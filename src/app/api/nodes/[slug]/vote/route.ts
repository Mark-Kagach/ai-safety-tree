import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  value: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
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
    return new Response("Invalid vote", { status: 400 });
  }

  if (parsed.data.value === 0) {
    await prisma.nodeVote.deleteMany({
      where: { userId: user.id, nodeId: node.id },
    });
  } else {
    await prisma.nodeVote.upsert({
      where: { userId_nodeId: { userId: user.id, nodeId: node.id } },
      create: {
        userId: user.id,
        nodeId: node.id,
        value: parsed.data.value,
      },
      update: { value: parsed.data.value },
    });
  }

  return new Response(null, { status: 204 });
}
