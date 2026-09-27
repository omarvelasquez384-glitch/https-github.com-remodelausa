import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Navegación con desplazamiento suave hacia secciones de la página principal.
// Problema que resuelve: desde otras rutas (/track, /s/...), un enlace a "/#contact"
// recargaba la página y el navegador intentaba saltar al ancla ANTES de que React
// terminara de renderizar (con el preloader bloqueando el scroll), así que el
// usuario terminaba en la parte superior sin saber por qué. Ahora guardamos la
// sección destino en sessionStorage y Home la aplica al terminar el preloader.
const PENDING_SCROLL_KEY = "remodelausa:pending-scroll"

export function requestSectionScroll(href: string) {
  if (window.location.pathname === "/") {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  } else {
    sessionStorage.setItem(PENDING_SCROLL_KEY, href)
    window.location.assign("/")
  }
}

export function consumePendingScroll(): string | null {
  const v = sessionStorage.getItem(PENDING_SCROLL_KEY)
  if (v) sessionStorage.removeItem(PENDING_SCROLL_KEY)
  return v
}
