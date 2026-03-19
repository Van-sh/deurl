import { Link } from "@tanstack/react-router";

import { env } from "~/env";
import BetterAuthHeader from "./BetterAuthHeader";

export default function Header() {
   return (
      <header className="border-b border-border bg-background/80 backdrop-blur">
         <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2">
               {env.VITE_APP_NAME}
            </Link>
            <BetterAuthHeader />
         </div>
      </header>
   );
}
