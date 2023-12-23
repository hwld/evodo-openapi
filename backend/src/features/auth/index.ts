import { appRouter } from "../../app";
import { cancelSignup } from "./routes/cancel-signup";
import { login } from "./routes/login";
import { loginCallback } from "./routes/login-callback";
import { logout } from "./routes/logout";
import { session } from "./routes/session";
import { signup } from "./routes/signup";
import { signupSession } from "./routes/signup-session";

export const authRoute = appRouter()
  .route("/", login)
  .route("/", loginCallback)
  .route("/", signup)
  .route("/", signupSession)
  .route("/", cancelSignup)
  .route("/", logout)
  .route("/", session);
