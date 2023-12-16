import { appRouter } from "../../app";
import { login } from "./routes/login";
import { loginCallback } from "./routes/loginCallback";
import { logout } from "./routes/logout";

export const authRoute = appRouter()
  .route("/", login)
  .route("/", loginCallback)
  .route("/", logout);
