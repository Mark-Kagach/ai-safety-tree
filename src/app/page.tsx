import { getCurrentUser } from "@/lib/auth";
import { getTreeForView } from "@/lib/data";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [user, tree] = await Promise.all([
    getCurrentUser(),
    getTreeForView(),
  ]);

  return (
    <HomeClient
      initialTree={tree}
      currentUser={user ? { id: user.id, username: user.username } : null}
    />
  );
}
