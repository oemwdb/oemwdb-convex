import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RootErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <h1 style={{ color: "#b91c1c", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>
            {this.state.error.message}
          </p>
          <pre
            style={{
              background: "#fef2f2",
              padding: "1rem",
              borderRadius: "6px",
              overflow: "auto",
              fontSize: "12px",
              color: "#991b1b",
            }}
          >
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
