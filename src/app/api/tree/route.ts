import { getTreeForView } from "@/lib/data";

export async function GET() {
  const tree = await getTreeForView();
  return Response.json(tree);
}
