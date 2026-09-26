import { useState, useEffect } from 'react';
import { MapPin, Globe, Loader2, RefreshCw } from 'lucide-react';
import { getLanguage, type Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Ubicación del usuario: geolocalización del navegador + consulta web
// (reverse geocoding con Nominatim / OpenStreetMap) para personalizar la
// experiencia y mostrar contratistas disponibles en su zona.
// -----------------------------------------------------------------------------

export interface UserLocation {
  lat: number;
  lon: number;
  city: string;
  state: string;
  display: string;
}

const STORAGE_KEY = 'remodelausa-location';

export function getStoredLocation(): UserLocation | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserLocation) : null;
  } catch {
    return null;
  }
}

function saveLocation(loc: UserLocation): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
}

// Número determinista de contratistas por estado (simulado, estable por nombre)
export function getContractorCount(state: string): number {
  let hash = 0;
  for (let i = 0; i < state.length; i++) {
    hash = (hash * 31 + state.charCodeAt(i)) % 997;
  }
  return 25 + (hash % 96); // 25–120
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  display_name?: string;
}

// Consulta web: convierte coordenadas en ciudad/estado legible
async function reverseGeocode(lat: number, lon: number): Promise<UserLocation> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=${getLanguage()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('geocode failed');
  const data = (await response.json()) as { address?: NominatimAddress; display_name?: string };
  const addr = data.address ?? {};
  const city = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? '';
  const state = addr.state ?? '';
  return {
    lat,
    lon,
    city,
    state,
    display: data.display_name ?? (city && state ? `${city}, ${state}` : `${lat.toFixed(4)}, ${lon.toFixed(4)}`),
  };
}

export async function detectLocation(): Promise<UserLocation> {
  if (!('geolocation' in navigator)) {
    throw new Error('unsupported');
  }
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
  const loc = await reverseGeocode(position.coords.latitude, position.coords.longitude);
  saveLocation(loc);
  return loc;
}

// -----------------------------------------------------------------------------
// Textos del componente por idioma
// -----------------------------------------------------------------------------
const STRINGS = {
  en: {
    detecting: 'Detecting your location...',
    useLocation: 'Use my location',
    updateLocation: 'Update',
    contractorsIn: (city: string, state: string) =>
      city && state ? `Contractors available in ${city}, ${state}` : state ? `Contractors available in ${state}` : 'Contractors available in your area',
    count: (n: number) => `${n} verified contractors`,
    online: 'Online',
    offline: 'Offline — quotes will load when you reconnect',
    errorDenied: 'Location permission denied. You can enable it in your browser settings.',
    errorUnavailable: 'Could not detect your location right now.',
    errorGeocode: 'Could not resolve your address from the web.',
  },
  es: {
    detecting: 'Detectando tu ubicación...',
    useLocation: 'Usar mi ubicación',
    updateLocation: 'Actualizar',
    contractorsIn: (city: string, state: string) =>
      city && state ? `Contratistas disponibles en ${city}, ${state}` : state ? `Contratistas disponibles en ${state}` : 'Contratistas disponibles en tu zona',
    count: (n: number) => `${n} contratistas verificados`,
    online: 'En línea',
    offline: 'Sin conexión — las cotizaciones cargarán al reconectarte',
    errorDenied: 'Permiso de ubicación denegado. Puedes activarlo en la configuración de tu navegador.',
    errorUnavailable: 'No pudimos detectar tu ubicación en este momento.',
    errorGeocode: 'No pudimos obtener tu dirección desde la web.',
  },
  pt: {
    detecting: 'Detectando sua localização...',
    useLocation: 'Usar minha localização',
    updateLocation: 'Atualizar',
    contractorsIn: (city: string, state: string) =>
      city && state ? `Construtoras disponíveis em ${city}, ${state}` : state ? `Construtoras disponíveis em ${state}` : 'Construtoras disponíveis na sua região',
    count: (n: number) => `${n} construtoras verificadas`,
    online: 'Online',
    offline: 'Offline — os orçamentos carregarão quando você reconectar',
    errorDenied: 'Permissão de localização negada. Você pode ativá-la nas configurações do navegador.',
    errorUnavailable: 'Não conseguimos detectar sua localização agora.',
    errorGeocode: 'Não conseguimos obter seu endereço da web.',
  },
} as const;

export function LocationBar() {
  const lang = getLanguage() as Lang;
  const t = STRINGS[lang] ?? STRINGS.en;
  const [location, setLocation] = useState<UserLocation | null>(getStoredLocation());
  const [status, setStatus] = useState<'idle' | 'detecting' | 'error-denied' | 'error-unavailable' | 'error-geocode'>('idle');
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const handleDetect = async () => {
    setStatus('detecting');
    try {
      const loc = await detectLocation();
      setLocation(loc);
      setStatus('idle');
    } catch (err) {
      const code = (err as { code?: number })?.code;
      if (code === 1) setStatus('error-denied');
      else if (typeof code === 'number') setStatus('error-unavailable');
      else setStatus('error-geocode');
    }
  };

  const errorMessage =
    status === 'error-denied' ? t.errorDenied :
    status === 'error-unavailable' ? t.errorUnavailable :
    status === 'error-geocode' ? t.errorGeocode : null;

  return (
    <div className="fade-up max-w-3xl mx-auto mb-10">
      <div className="flex flex-wrap items-center justify-center gap-3 px-5 py-4 bg-white/5 rounded-lg border border-white/10">
        {location ? (
          <>
            <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-white/85">
              {t.contractorsIn(location.city, location.state)}
            </span>
            <span className="text-sm text-gold-400 font-medium">
              {t.count(getContractorCount(location.state || location.display))}
            </span>
            <button
              onClick={handleDetect}
              disabled={status === 'detecting'}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-gold-400 transition-colors disabled:opacity-50"
              aria-label={t.updateLocation}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status === 'detecting' ? 'animate-spin' : ''}`} />
              {t.updateLocation}
            </button>
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0" aria-hidden="true" />
            <button
              onClick={handleDetect}
              disabled={status === 'detecting'}
              className="text-sm text-white/85 hover:text-gold-400 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {status === 'detecting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.detecting}
                </>
              ) : (
                t.useLocation
              )}
            </button>
          </>
        )}

        <span className="ml-auto flex items-center gap-1.5 text-xs">
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={online ? 'text-white/50' : 'text-red-400'}>
            {online ? t.online : t.offline}
          </span>
          <Globe className="w-3.5 h-3.5 text-white/30" aria-hidden="true" />
        </span>
      </div>

      {errorMessage && (
        <p className="text-center text-sm text-red-400 mt-3">{errorMessage}</p>
      )}
    </div>
  );
}
