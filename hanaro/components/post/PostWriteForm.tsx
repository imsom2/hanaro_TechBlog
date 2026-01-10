"use client";

import { useRouter } from "next/navigation";
import { useActionState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertOrDeletePost } from "@/lib/posts/post.action";

// 수정 화면에서 미리 채워둘 값 타입
type DefaultValues = {
  postId?: number;
  title?: string;
  content?: string;
  categories?: string[];
};

type Props = {
  categories: { id: number; title: string }[]; // 체크박스
  defaultValues?: DefaultValues; // 수정 모드 기본값
  mode?: "create" | "edit"; // 새로 만드는지, 수정인지 모드
};

export default function PostWriteForm({
  categories,
  defaultValues,
  mode = "create",
}: Props) {
  const router = useRouter(); // 취소 버튼 누를 시 / 로 이동 위함

  const postId = defaultValues?.postId;
  const isEdit = mode === "edit";

  // 수정 모드 시 카테고리 미리 체크해두기 위함
  const selectedSet = useMemo(
    () => new Set(defaultValues?.categories ?? []),
    [defaultValues?.categories],
  );

  //return 값 / 서버 액션 /제출중 로딩 상태
  const [state, action, pending] = useActionState(
    upsertOrDeletePost,
    undefined,
  );

  return (
    <div className="mt-6 grid grid-cols-[220px_1fr] gap-8">
      {/* 왼쪽 카테고리 */}
      <aside className="rounded-lg border bg-muted/20 p-4">
        <div className="mb-3 text-sm font-medium">카테고리 선택</div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {categories.map((c) => {
            const inputId = `cat-${c.id}`; // 체크박스마다 id 설정

            return (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
              >
                <input
                  id={inputId}
                  type="checkbox"
                  name="categories"
                  value={c.title}
                  defaultChecked={selectedSet.has(c.title)} // edit모드일 때 이미 선택된 거 체크된 상태로
                  className="h-4 w-4"
                  form="post-form" // 오른쪽 작성 폼과 연결
                />

                <Label htmlFor={inputId} className="cursor-pointer">
                  {c.title}
                </Label>
              </div>
            );
          })}
        </div>
      </aside>

      {/* 오른쪽: 작성/수정 폼 */}
      <section className="rounded-lg border p-6">
        <form id="post-form" action={action} className="space-y-5">
          {isEdit && <input type="hidden" name="postId" value={postId ?? ""} />}
          <input type="hidden" name="mode" value={mode} />

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="title..."
              defaultValue={defaultValues?.title ?? ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="content..."
              defaultValue={defaultValues?.content ?? ""}
              className="min-h-40"
            />
          </div>

          {state?.message && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/")}
              disabled={pending}
            >
              취소
            </Button>

            <div className="flex items-center gap-3">
              {isEdit && (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={pending || !postId}
                  name="intent"
                  value="delete"
                  onClick={(e) => {
                    if (!confirm("정말 삭제할까요?")) e.preventDefault();
                  }}
                >
                  삭제
                </Button>
              )}

              <Button
                type="submit"
                disabled={pending || (isEdit && !postId)}
                name="intent"
                value="save"
              >
                {isEdit ? "수정 저장" : "저장"}
                {pending ? "..." : ""}
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
