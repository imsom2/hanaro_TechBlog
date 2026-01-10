import { redirect } from "next/navigation";
import UserSearchBar from "@/components/admin/UserSearchBar";
import UserTable from "@/components/admin/UserTable";
import { getUsers } from "@/lib/admin/user.action";
import { auth } from "@/lib/auth/auth";

type SP = { q?: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/auth/sign-in");
  if (!session.user.isadmin) redirect("/");

  const sp = await Promise.resolve(searchParams ?? {});
  const q = (sp.q ?? "").trim();

  // 검색어 있으면 필터, 없으면 전체
  const users = await getUsers(q);

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">회원관리</h1>

          <p className="text-sm text-muted-foreground">
            {q ? (
              <>
                검색어: <span className="font-medium">"{q}"</span> · 결과{" "}
                <span className="font-medium">{users.length}</span>명
              </>
            ) : (
              <>
                전체 회원 <span className="font-medium">{users.length}</span>명
              </>
            )}
          </p>
        </div>

        <div className="w-full sm:max-w-md">
          <UserSearchBar defaultValue={q} />
        </div>
      </header>

      <UserTable users={users} />
    </div>
  );
}
