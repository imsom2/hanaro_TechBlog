"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  defaultValue?: string;
};

export default function SearchBar({ defaultValue = "" }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams(params.toString());
    const q = value.trim();

    if (!q) sp.delete("q");
    else sp.set("q", q);

    router.push(`/posts/search?${sp.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제목 또는 내용으로 검색..."
      />
      <Button type="submit">검색</Button>
    </form>
  );
}
