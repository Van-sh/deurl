import { Link } from "@tanstack/react-router";

import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export default function BetterAuthHeader() {
   const { data: session, isPending } = authClient.useSession();
   const user = session?.user;

   if (isPending) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
   }

   if (!user) {
      return (
         <Button render={<Link to="/login" />} nativeButton={false}>
            Log In
         </Button>
      );
   }

   const isAnonymous = user.isAnonymous;
   const initial = user.name.charAt(0).toUpperCase() || "U";

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="cursor-pointer rounded-full outline-offset-1 hover:outline-2">
            <Avatar className="h-8 w-8">
               <AvatarImage src={user.image ?? undefined} alt={user.name} />
               <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
               <DropdownMenuLabel className="flex flex-col">
                  <span className="text-xs font-medium">
                     {user.name || (isAnonymous ? "Anonymous user" : "User")}
                  </span>
                  {!isAnonymous && user.email && (
                     <span className="truncate text-muted-foreground">{user.email}</span>
                  )}
               </DropdownMenuLabel>
               {isAnonymous && (
                  <DropdownMenuItem render={<Link to="/login" className="cursor-pointer" />}>
                     Link account
                  </DropdownMenuItem>
               )}
               <DropdownMenuItem render={<Link to="/dashboard" className="cursor-pointer" />}>
                  Open dashboard
               </DropdownMenuItem>
               {!isAnonymous && (
                  <DropdownMenuItem onClick={() => authClient.signOut()} className="cursor-pointer">
                     Log Out
                  </DropdownMenuItem>
               )}
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
