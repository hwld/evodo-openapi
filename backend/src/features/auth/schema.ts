import { z } from "zod";
import { UserSchema } from "../user/schema";

export const SessionSchema = z.object({ user: UserSchema }).openapi("Session");
