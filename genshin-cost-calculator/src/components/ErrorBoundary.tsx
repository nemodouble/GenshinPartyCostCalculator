import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
  stack?: string;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // 개발 편의를 위한 로그
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, info);
    this.setState({
      stack: info.componentStack || undefined,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, color: '#b00020' }}>
          <h2>화면 렌더링 중 오류가 발생했습니다.</h2>
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {this.state.message}
          </div>
          {this.state.stack && (
            <details style={{ marginTop: 12 }}>
              <summary>스택</summary>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.stack}</pre>
            </details>
          )}
          <p style={{ marginTop: 12, color: '#333' }}>
            콘솔(Console)에도 동일한 오류가 찍힙니다. 위 메시지를 보내주면 바로 고칠게요.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
