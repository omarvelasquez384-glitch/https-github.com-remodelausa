import { Component, type ReactNode } from 'react';
import { getLanguage, type Lang } from '../i18n';

// Red de seguridad: si cualquier error de renderizado tumba el árbol React,
// muestra una pantalla de fallback con botón de recarga en vez de un
// viewport negro vacío.
const STRINGS: Record<Lang, { title: string; message: string; reload: string }> = {
  en: {
    title: 'Something went wrong',
    message: 'The page ran into an unexpected error. Reload to try again.',
    reload: 'Reload page',
  },
  es: {
    title: 'Algo salió mal',
    message: 'La página encontró un error inesperado. Recarga para intentarlo de nuevo.',
    reload: 'Recargar página',
  },
  pt: {
    title: 'Algo deu errado',
    message: 'A página encontrou um erro inesperado. Recarregue para tentar novamente.',
    reload: 'Recarregar página',
  },
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    const t = STRINGS[getLanguage()] ?? STRINGS.en;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#141414] px-6 text-center">
        <h1 className="text-2xl font-semibold text-white">{t.title}</h1>
        <p className="max-w-md text-white/70">{t.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-sm bg-[#d2a855] px-6 py-3 font-semibold text-black hover:brightness-110"
        >
          {t.reload}
        </button>
      </div>
    );
  }
}
