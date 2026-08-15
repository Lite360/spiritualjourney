import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-[#E8E1D4] p-10 text-center">
            <div className="w-16 h-16 bg-[#344236]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#344236]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-[#171717] mb-3">Something went wrong</h1>
            <p className="text-[#344236]/70 font-sans text-sm mb-2">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            {this.state.error?.message?.includes('supabase') || this.state.error?.message?.includes('URL') ? (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                <p className="text-sm font-sans font-medium text-amber-800 mb-2">Missing Supabase Configuration</p>
                <p className="text-xs font-sans text-amber-700">
                  Create a <code className="bg-amber-100 px-1 rounded">.env</code> file in your project root with:
                </p>
                <pre className="mt-2 text-xs bg-amber-100 rounded p-2 text-amber-900 overflow-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </div>
            ) : null}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 bg-[#344236] text-white rounded-full font-sans text-sm hover:bg-[#344236]/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
