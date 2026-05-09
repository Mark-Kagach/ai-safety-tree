import { z } from "zod";
import { signUp, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return new Response("Invalid signup", { status: 400 });
  }

  try {
    const user = await signUp(parsed.data.username, parsed.data.password);
    await setSessionCookie(user.id);
    return Response.json({ id: user.id, username: user.username });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Signup failed";
    return new Response(msg, { status: 400 });
  }
}
