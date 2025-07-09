import { db } from "../../../lib/db";
import { users } from "../../../lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const body = await request.json();

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email));

  if (existing.length > 0) {
    return new Response(JSON.stringify({ message: "Email already exists" }), {
      status: 400,
    });
  }

  // ✅ Hash the password before storing
  const hashedPassword = await bcrypt.hash(body.password, 10); // 10 = salt rounds

  await db.insert(users).values({
    name: body.name,
    email: body.email,
    password: hashedPassword,
  });

  return new Response(JSON.stringify({ message: "User created" }), {
    status: 200,
  });
}
