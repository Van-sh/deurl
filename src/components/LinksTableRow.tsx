import { Copy, CopyCheck, ExternalLink, Trash2, Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import type { Link } from "~api/modules/links/links.models";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";

type LinksTableRowProps = {
   link: Link;
   editingThisLink: boolean;
   deletingThisLink: boolean;
   onRequestEdit: () => void;
   onRequestDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function LinksTableRow({
   link,
   editingThisLink,
   deletingThisLink,
   onRequestDelete,
   onRequestEdit,
}: LinksTableRowProps) {
   const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
   const [copiedLink, setCopiedLink] = useState<number | undefined>(undefined);

   async function handleCopy() {
      await navigator.clipboard.writeText(`${window.location.origin}/l/${link.code}`);
      toast.success(`Copied short link to ${link.originalUrl}`);
      setCopiedLink(link.id);
      if (timeoutRef.current !== null) {
         clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopiedLink(undefined), 1000);
   }

   return (
      <TableRow>
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
         <TableCell className="max-w-xs truncate">
            <span className="w-full">{link.code}</span>
         </TableCell>
         <TableCell>{"clickCount" in link ? link.clickCount : "-"}</TableCell>
         <TableCell className="text-right">
            <div className="flex justify-end gap-2">
               <Button
                  size="icon"
                  variant="outline"
                  disabled={editingThisLink}
                  aria-label="edit link"
                  onClick={onRequestEdit}
               >
                  <Pencil />
               </Button>
               <Button size="icon" variant="outline" aria-label="copy link" onClick={handleCopy}>
                  {copiedLink === link.id ? <CopyCheck /> : <Copy />}
               </Button>
               <Button
                  size="icon"
                  variant="destructive"
                  disabled={deletingThisLink}
                  aria-label="delete link"
                  onClick={onRequestDelete}
               >
                  <Trash2 />
               </Button>
            </div>
         </TableCell>
      </TableRow>
   );
}
