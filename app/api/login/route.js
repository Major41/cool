// app/api/login/route.js
import { db } from "../../../lib/db";
import { users } from "../../../lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // ✅ Fetch user by email
    const found = await db.select().from(users).where(eq(users.email, email));

    const user = found[0];

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    // ✅ Clean response (omit password)
    const { password, ...userWithoutPassword } = user;

    // ✅ You can set a cookie, JWT, or redirect here
    return new Response(
      JSON.stringify(userWithoutPassword),
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ message: "Login failed" }), {
      status: 500,
    });
  }
}
