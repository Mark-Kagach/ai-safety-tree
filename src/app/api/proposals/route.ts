import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify, ensureUniqueSlug } from "@/domain/slug";

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().min(1),
});

// v1 simplification: a "proposal" creates the node directly. Proposal voting
// (acceptance threshold) is Phase 3 work — see ARCHITECTURE.md §4.2.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return new Response("Invalid proposal", { status: 400 });
  }

  const parent = await prisma.node.findUnique({
    where: { id: parsed.data.parentId },
  });
  if (!parent) return new Response("Parent not found", { status: 400 });

  const allSlugs = (
    await prisma.node.findMany({ select: { slug: true } })
  ).map((n) => n.slug);
  const baseSlug = slugify(parsed.data.title) || "node";
  const slug = ensureUniqueSlug(baseSlug, new Set(allSlugs));

  const node = await prisma.node.create({
    data: {
      slug,
      title: parsed.data.title,
      body: parsed.data.body,
      parentId: parent.id,
      authorId: user.id,
      isSeed: false,
      // Marked as a community proposal — surfaces under the target node's
      // "Other Proposals" section, not on the main canvas.
      status: "proposed",
    },
  });

  return Response.json({ slug: node.slug, id: node.id });
}
