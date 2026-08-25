import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="text-5xl mb-6">🎬</div>
          <h1 className="font-serif text-3xl text-accent mb-4">Technical Difficulties</h1>
          <p className="text-text-secondary max-w-md mb-8">
            Even the best projectors jam occasionally. We encountered an unexpected error.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl border border-accent bg-bg-secondary text-text-primary hover:bg-surface transition-colors"
          >
            Restart the reel
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
