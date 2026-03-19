import { useSuspenseQuery } from "@tanstack/react-query";
import { Copy, CopyCheck, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { getAllLinkOptions } from "~/query/link";
import type { Link } from "~api/modules/links/model";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function LinksTable() {
   const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
   const { data } = useSuspenseQuery(getAllLinkOptions);
   const [copiedLink, setCopiedLink] = useState<number | undefined>(undefined);

   if (data.length === 0) {
      return (
         <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            You haven{"'"}t created any links yet.
         </div>
      );
   }

   async function handleCopy(link: Link) {
      await navigator.clipboard.writeText(`${window.location.origin}/l/${link.code}`);
      toast.success(`Copied short link to ${link.originalUrl}`);
      setCopiedLink(link.id);
      if (timeoutRef.current !== null) {
         clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopiedLink(undefined), 1000);
   }

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Original URL</TableHead>
               <TableHead>Short URL</TableHead>
               <TableHead className="w-24">Clicks</TableHead>
               <TableHead className="w-24" />
            </TableRow>
         </TableHeader>
         <TableBody>
            {data.map((link) => (
               <TableRow key={link.id}>
                  <TableCell className="max-w-xs truncate">
                     <Button
                        nativeButton={false}
                        render={<a href={link.originalUrl} />}
                        variant={"link"}
                        className="text-foreground"
                     >
                        <ExternalLink />
                        {link.originalUrl}
                     </Button>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{link.code}</TableCell>
                  <TableCell>{"clickCount" in link ? link.clickCount : "-"}</TableCell>
                  <TableCell className="text-right">
                     <Button size="icon" variant="outline" onClick={() => handleCopy(link)}>
                        {copiedLink === link.id ? <CopyCheck /> : <Copy />}
                     </Button>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
