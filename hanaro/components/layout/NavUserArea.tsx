"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";
import UserProfile from "./user/UserProfile";

function NavUserAreaInner() {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user;
  const isAdmin = !!session?.user?.isadmin;

  return (
    <div className="ml-auto flex items-center gap-4">
      {/* 관리자 전용 메뉴 */}
      {isAdmin && (
        <>
          <Link href="/admin" className="text-sm font-medium">
            회원관리
          </Link>

          <Link
            href="/posts/write"
            className="rounded-full border px-4 py-2 text-sm font-medium"
          >
            새 글 작성
          </Link>
        </>
      )}

      {/*  게시글 검색 */}
      <Link
        href="/posts/search"
        aria-label="search"
        className="rounded-full p-2 hover:bg-muted"
      >
        <Search className="h-5 w-5" />
      </Link>

      {/*  로그인 상태 표시 */}
      {status === "loading" ? (
        <span className="text-sm text-muted-foreground">...</span>
      ) : isLoggedIn ? (
        <UserProfile data={session} />
      ) : (
        <Link href="/auth/sign-in" className="text-sm">
          sign in
        </Link>
      )}
    </div>
  );
}

export default function NavUserArea() {
  return (
    <SessionProvider>
      <NavUserAreaInner />
    </SessionProvider>
  );
}
