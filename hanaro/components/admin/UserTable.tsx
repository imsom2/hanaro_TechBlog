import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserRow = {
  id: number;
  name: string;
  email: string;
  isadmin: boolean;
  image: string | null;
};

function getInitials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "US";

  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();

  return n.slice(0, 2).toUpperCase();
}

export default function UserTable({ users }: { users: UserRow[] }) {
  if (!users?.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        검색 결과가 없어요.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-80">ID</TableHead>
            <TableHead>사용자</TableHead>
            <TableHead className="w-280">이메일</TableHead>
            <TableHead className="w-120 text-right">권한</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => {
            const initials = getInitials(u.name);

            return (
              <TableRow key={u.id}>
                <TableCell className="text-muted-foreground">{u.id}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.image ?? undefined} alt={u.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="leading-tight">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {u.email}
                </TableCell>

                <TableCell className="text-right">
                  <Badge variant={u.isadmin ? "default" : "secondary"}>
                    {u.isadmin ? "admin" : "user"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
