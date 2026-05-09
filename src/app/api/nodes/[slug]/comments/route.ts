import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { slug } = await params;
  const node = await prisma.node.findUnique({ where: { slug } });
  if (!node) return new Response("Not found", { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return new Response("Invalid comment", { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      nodeId: node.id,
      authorId: user.id,
      body: parsed.data.body,
    },
    include: { author: true },
  });

  return Response.json({
    id: comment.id,
    body: comment.body,
    authorUsername: comment.author.username,
    createdAt: comment.createdAt.toISOString(),
  });
}
