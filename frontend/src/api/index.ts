import { createApiClient } from "./schema";

export const api = createApiClient(`${import.meta.env.VITE_API_URL}`);
