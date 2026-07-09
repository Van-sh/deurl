import { Copy, CopyCheck, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { TableCell, TableRow } from "~/components/ui/table";
import type { Link } from "../server/api/links.models";

type LinksTableRowProps = {
   link: Link;
   editingThisLink: boolean;
   deletingThisLink: boolean;
   onRequestEdit: () => void;
   onRequestDelete: (e: MouseEvent<HTMLButtonElement>) => void;
};

export default function LinksTableRow({
   link,
   editingThisLink,
   deletingThisLink,
   onRequestDelete,
   onRequestEdit,
}: LinksTableRowProps) {
   const [isCopied, setIsCopied] = useState(false);

   async function handleCopy() {
      await navigator.clipboard.writeText(`${window.location.origin}/l/${link.code}`);
      toast.success(`Copied short link to ${link.originalUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
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
               <Button size="icon" variant="secondary" aria-label="copy link" onClick={handleCopy}>
                  {isCopied ? <CopyCheck /> : <Copy />}
               </Button>

               <Button
                  size="icon"
                  variant="secondary"
                  disabled={editingThisLink}
                  aria-label="edit link"
                  onClick={onRequestEdit}
               >
                  <Pencil />
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
