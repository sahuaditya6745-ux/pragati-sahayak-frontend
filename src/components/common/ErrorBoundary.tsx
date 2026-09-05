import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md rounded-3xl border border-destructive/30 bg-card p-6 shadow-xl sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Something went wrong. Please refresh the page or return to the main dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-xl bg-saffron px-5 text-sm font-bold text-saffron-foreground shadow-sm transition hover:opacity-90 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Optional Collapsible Technical Details */}
            {this.state.error && (
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mx-auto"
                >
                  <span>Technical details</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      this.state.showDetails ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2.5 max-h-40 overflow-auto rounded-xl bg-muted/50 p-3 text-[11px] font-mono text-destructive leading-normal border border-border">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
