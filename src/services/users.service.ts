import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersService = {
  async registerUser(payload: typeof users.$inferInsert) {
    // Check if user with email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        status: 400,
        success: false,
        message: "User already exists",
        data: null,
      };
    }

    // Hash the password using Bun's native password hasher (bcrypt by default)
    const hashedPassword = await Bun.password.hash(payload.password);

    // Insert new user
    const [result] = await db.insert(users).values({
      ...payload,
      password: hashedPassword,
    });

    // Fetch the newly created user to return it
    const newUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, result.insertId))
      .limit(1);

    return {
      status: 201,
      success: true,
      message: "User created successfully",
      data: newUser[0],
    };
  },
};
