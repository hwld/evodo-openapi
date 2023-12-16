import { appRouter } from "../../app";
import { login } from "./routes/login";
import { loginCallback } from "./routes/loginCallback";
import { logout } from "./routes/logout";
import { session } from "./routes/session";

export const authRoute = appRouter()
  .route("/", login)
  .route("/", loginCallback)
  .route("/", logout)
  .route("/", session);
