/* ============================================================
 * ErrorBoundary.tsx
 * Catches any render errors to prevent white-screen crashes.
 * ============================================================ */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 text-center space-y-3 my-4">
          <div className="flex justify-center text-rose-400">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-base font-bold text-white">
            {this.props.fallbackTitle || 'حدث خطأ غير متوقع أثناء تحميل هذا القسم'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {this.state.error?.message || 'تعذر تحميل بيانات الشارت. يمكنك إعادة المحاولة.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>إعادة تحميل الصفحة</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
