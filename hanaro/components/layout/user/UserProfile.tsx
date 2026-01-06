"use client";

import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useReducer } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

const DUMMY_PROFILE_IMAGE = "/profile_dummy.png";

// 이름에서 이니셜 뽑기
function getInitials(name?: string | null) {
  const v = (name ?? "").trim();
  if (!v) return "GU";
  const parts = v.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || v.slice(0, 2).toUpperCase();
}

export default function UserProfile({ data }: { data: Session }) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [isOpen, toggleOpen] = useReducer((p) => !p, false);

  useEffect(() => {
    if (!data?.user) router.replace("/sign/in");
  }, [data?.user, router]);

  // user가 없으면 렌더 자체를 막아 UI 깜빡임 방지
  if (!data?.user) return null;

  const profileImg = data.user.image || DUMMY_PROFILE_IMAGE;

  const Comp = isMobile
    ? { Root: Popover, Trigger: PopoverTrigger, Content: PopoverContent }
    : { Root: HoverCard, Trigger: HoverCardTrigger, Content: HoverCardContent };

  const initials = getInitials(data.user.name);

  return (
    <Comp.Root open={isOpen} onOpenChange={toggleOpen}>
      <Comp.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="touch-none md:pointer-events-auto md:touch-auto"
          aria-label="user menu"
        >
          <Avatar>
            <AvatarImage src={profileImg} alt={data.user.name || "user"} />
            <AvatarFallback className="text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </Comp.Trigger>

      <Comp.Content side="right" className="w-auto max-w-80">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profileImg} alt={data.user.name || "user"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <h4 className="truncate text-sm font-semibold">
              @{data.user.name ?? "guest"}
            </h4>
            <p className="truncate text-sm text-muted-foreground">
              {data.user.email ?? ""}
            </p>

            <Button
              onClick={() => signOut({ callbackUrl: "/sign/in" })}
              variant="outline"
              size="sm"
            >
              LogOut
            </Button>
          </div>
        </div>
      </Comp.Content>
    </Comp.Root>
  );
}
