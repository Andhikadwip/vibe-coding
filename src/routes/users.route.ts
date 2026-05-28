import { Elysia, t } from "elysia";
import { usersService } from "../services/users.service";

export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    const result = await usersService.registerUser(body);

    set.status = result.status;
    return result;
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 6 }),
    }),
  }
);
