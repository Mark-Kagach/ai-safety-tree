import { getCurrentUser } from "@/lib/auth";
import { getNodeBySlug } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const node = await getNodeBySlug(slug, user?.id ?? null);
  if (!node) return new Response("Not found", { status: 404 });
  return Response.json(node);
}
