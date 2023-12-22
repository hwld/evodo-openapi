import { appRouter } from "../../app";
import { cancelSignup } from "./routes/cancel-signup";
import { login } from "./routes/login";
import { loginCallback } from "./routes/login-callback";
import { logout } from "./routes/logout";
import { session } from "./routes/session";
import { signup } from "./routes/signup";

export const authRoute = appRouter()
  .route("/", login)
  .route("/", loginCallback)
  .route("/", signup)
  .route("/", cancelSignup)
  .route("/", logout)
  .route("/", session);
