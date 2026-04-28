import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function RootFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-text-supporting">
      <div className="content-container space-y-3">
        <h1 className="text-2xl">Loading…</h1>
        <p className="text-supporting">Preparing the practice space.</p>
      </div>
    </div>
  );
}

function showModuleFallback() {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  rootElement.innerHTML = `
    <div class="root-module-fallback">
      <div>
        <h1>Loading…</h1>
        <p>Refreshing the practice space.</p>
      </div>
    </div>
  `;
}

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Root render failed", error, info);
  }

  render() {
    if (this.state.hasError) return <RootFallback />;
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  window.addEventListener("error", (event) => {
    console.error("Root runtime error", event.error ?? event.message);
    showModuleFallback();
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Root promise rejection", event.reason);
    showModuleFallback();
  });

  import("./App.tsx")
    .then(({ default: App }) => {
      createRoot(rootElement).render(
        <React.StrictMode>
          <RootErrorBoundary>
            <App />
          </RootErrorBoundary>
        </React.StrictMode>,
      );
    })
    .catch((error) => {
      console.error("App module failed to load", error);
      showModuleFallback();
    });
}
