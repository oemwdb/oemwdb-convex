import React, { Component, ErrorInfo, ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { WheelsPageErrorFallback } from "./WheelsPageErrorFallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WheelsPageErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("WheelsPageErrorBoundary:", error.message, errorInfo.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <DashboardLayout title="Wheels" showFilterButton={false}>
          <WheelsPageErrorFallback error={this.state.error} resetErrorBoundary={this.reset} />
        </DashboardLayout>
      );
    }
    return this.props.children;
  }
}
