import { z } from "zod";
import { signIn, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return new Response("Invalid login", { status: 400 });
  }
  const user = await signIn(parsed.data.username, parsed.data.password);
  if (!user) return new Response("Invalid credentials", { status: 401 });
  await setSessionCookie(user.id);
  return Response.json({ id: user.id, username: user.username });
}
