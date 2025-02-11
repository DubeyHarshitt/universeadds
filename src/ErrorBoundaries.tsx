import React, { Component, ErrorInfo, ReactNode } from 'react';
import Status404 from './content/pages/Status/Status404';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBound extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.

    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <Status404 />;
    }

    return this.props.children;
  }
}

export default ErrorBound;
