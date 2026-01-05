"use client";

import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { useReducer } from "react";
import { logout } from "@/app/sign/api/sign-out.action";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const DummyProfileImage = "/profile_dummy.png";

export default function UserProfile({ data }: { data: Session }) {
  if (!data || !data.user) redirect("/sign/in");

  const [isOpen, toggleOpen] = useReducer((p) => !p, false);

  const profileImg = data.user.image || DummyProfileImage;
  const isMobile = useIsMobile();

  const Comp = isMobile
    ? { comp: Popover, trigger: PopoverTrigger, content: PopoverContent }
    : { comp: HoverCard, trigger: HoverCardTrigger, content: HoverCardContent };

  return (
    <Comp.comp open={isOpen} onOpenChange={toggleOpen}>
      <Comp.trigger asChild>
        <Button
          variant="ghost"
          className="touch-none md:pointer-events-auto md:touch-auto"
        >
          <Avatar>
            <AvatarImage
              src={isMobile ? profileImg : undefined}
              alt={data.user.name || "guest"}
            />
            <AvatarFallback className="text-xl uppercase">
              {"guest".substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </Comp.trigger>
      <Comp.content side="right" className="w-auto max-w-80">
        <div className="flex justify-between gap-1">
          <div className="w-20">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profileImg}
                alt={data.user.name || "guest"}
                className=""
              />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
          </div>
          <div className="shrink-0 space-y-1">
            <h4 className="font-semibold text-sm">@{data.user.name}</h4>
            <p className="text-muted-foreground text-sm">{data.user.email}</p>
            <Button onClick={logout} variant={"outline"}>
              LogOut
            </Button>
          </div>
        </div>
      </Comp.content>
    </Comp.comp>
  );
}
