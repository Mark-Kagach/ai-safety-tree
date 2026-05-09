import { getCurrentUser } from "@/lib/auth";
import { getNodeBySlug, parseTreeVariant } from "@/lib/data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const variant = parseTreeVariant(url.searchParams.get("variant"));
  const user = await getCurrentUser();
  const node = await getNodeBySlug(slug, user?.id ?? null, variant);
  if (!node) return new Response("Not found", { status: 404 });
  return Response.json(node);
}
