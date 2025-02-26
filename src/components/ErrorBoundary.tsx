import React, { Component, ErrorInfo, ReactNode, ComponentType } from 'react';
import { MdOutlineReportProblem } from 'react-icons/md';
import IconComponent from './IconComponent';
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex gap-2">
          <IconComponent
            icon={
              MdOutlineReportProblem as ComponentType<{
                size?: number;
                color?: string;
              }>
            }
          />{' '}
          <span>Something went wrong.</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
