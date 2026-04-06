import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorInfo: null, copied: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("RootErrorBoundary caught:", error, errorInfo);
  }

  private getErrorPayload() {
    const { error, errorInfo } = this.state;
    const parts = [
      error?.message?.trim() || "Unknown error",
      "",
      error?.stack?.trim() || "",
      errorInfo?.componentStack?.trim() || "",
    ].filter(Boolean);

    return parts.join("\n\n");
  }

  private copyError = async () => {
    const payload = this.getErrorPayload();

    try {
      await navigator.clipboard.writeText(payload);
      this.setState({ copied: true });
      window.setTimeout(() => this.setState({ copied: false }), 1600);
      return;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = payload;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.setState({ copied: true });
      window.setTimeout(() => this.setState({ copied: false }), 1600);
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const payload = this.getErrorPayload();

      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "2rem 1.25rem",
            fontFamily: "system-ui, sans-serif",
            background: "#080808",
            color: "#f5f5f5",
          }}
        >
          <div
            style={{
              maxWidth: "1080px",
              margin: "0 auto",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              background: "#0f0f0f",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <h1 style={{ color: "#ef4444", margin: 0, fontSize: "1.85rem", fontWeight: 700 }}>
                  Something went wrong
                </h1>
                <p style={{ margin: "0.4rem 0 0", color: "rgba(245,245,245,0.7)", fontSize: "0.95rem" }}>
                  Copy the error and send it over.
                </p>
              </div>
              <button
                type="button"
                onClick={this.copyError}
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: this.state.copied ? "rgba(16,185,129,0.18)" : "#171717",
                  color: this.state.copied ? "#d1fae5" : "#f5f5f5",
                  padding: "0.65rem 1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {this.state.copied ? "Copied" : "Copy error"}
              </button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "1.45rem", lineHeight: 1.35 }}>
                {this.state.error.message}
              </p>
              <pre
                style={{
                  background: "#f4e8e8",
                  padding: "1.25rem",
                  borderRadius: "14px",
                  overflow: "auto",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#991b1b",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {payload}
              </pre>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
