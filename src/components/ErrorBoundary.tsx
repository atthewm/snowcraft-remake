'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Game error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-sky-100 font-game">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-sm">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Oops!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Something went wrong. Click below to restart.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#3498db', boxShadow: '0 4px 0 #2980b9' }}
            >
              RESTART
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
