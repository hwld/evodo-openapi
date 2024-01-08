import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./main.css";
import { Router, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routes";
import { notFoundRoute } from "./app/404.tsx";
import { LoadingPage } from "./app/loading.tsx";
import { ErrorPage } from "./app/error.tsx";
import { setupI18Next } from "./lib/i18next.ts";

setupI18Next();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const router = new Router({
  routeTree,
  notFoundRoute,
  defaultPendingComponent: LoadingPage,
  defaultErrorComponent: ErrorPage,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
