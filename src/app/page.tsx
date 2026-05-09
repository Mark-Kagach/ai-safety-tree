import { getCurrentUser } from "@/lib/auth";
import { getTreeForView, parseTreeVariant } from "@/lib/data";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const params = await searchParams;
  const variant = parseTreeVariant(params.variant);
  const [user, shallowTree, communityTree] = await Promise.all([
    getCurrentUser(),
    getTreeForView("shallow"),
    getTreeForView("community"),
  ]);

  return (
    <HomeClient
      initialShallowTree={shallowTree}
      initialCommunityTree={communityTree}
      initialVariant={variant}
      currentUser={user ? { id: user.id, username: user.username } : null}
    />
  );
}
