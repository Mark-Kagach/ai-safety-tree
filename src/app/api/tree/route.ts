import { getTreeForView, parseTreeVariant } from "@/lib/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const variant = parseTreeVariant(url.searchParams.get("variant"));
  const tree = await getTreeForView(variant);
  return Response.json(tree);
}
