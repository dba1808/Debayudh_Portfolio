import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error(`ErrorBoundary caught an uncaught exception:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI for 3D/Interactive elements that fail
      return (
        <div 
          className="w-full flex flex-col items-center justify-center border border-dashed border-violet-accent/20 rounded-3xl p-6 bg-[#050816]/40 min-h-[300px] text-center"
          style={{ minHeight: this.props.minHeight || "300px" }}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4 border border-red-500/25">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-white font-semibold text-[15px] tracking-wide">Scene Loading Suspended</h4>
          <p className="text-secondary text-[12px] max-w-sm mt-1">
            A device graphics constraint or memory threshold was hit. The rest of the page remains fully active.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
