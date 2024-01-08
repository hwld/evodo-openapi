import { setupI18Next } from "@/lib/i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";

setupI18Next();

const testQueryClient = new QueryClient();

export const renderWithRouter = async (router: Router) => {
  return render(
    <QueryClientProvider client={testQueryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};
