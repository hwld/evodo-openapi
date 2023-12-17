import { appRouter } from "../../app";
import { login } from "./routes/login";
import { loginCallback } from "./routes/loginCallback";
import { logout } from "./routes/logout";
import { session } from "./routes/session";
import { signup } from "./routes/signUp";

export const authRoute = appRouter()
  .route("/", login)
  .route("/", loginCallback)
  .route("/", signup)
  .route("/", logout)
  .route("/", session);
