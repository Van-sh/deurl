import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Copy, CopyCheck, ExternalLink, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { deleteLinkOptions, getAllLinkOptions } from "~/query/link";
import type { Link } from "~api/modules/links/links.models";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function LinksTable() {
   const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
   const queryClient = useQueryClient();
   const { data } = useSuspenseQuery(getAllLinkOptions);
   const [copiedLink, setCopiedLink] = useState<number | undefined>(undefined);
   const [pendingDeleteLink, setPendingDeleteLink] = useState<Link | null>(null);

   const { mutateAsync: deleteLink, isPending: isDeleting } = useMutation(
      deleteLinkOptions(
         () => {
            queryClient.invalidateQueries({ queryKey: getAllLinkOptions.queryKey });
            toast.success("Link deleted.");
         },
         (error) => {
            toast.error(error.message);
         },
      ),
   );

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

   async function handleDelete(link: Link) {
      await deleteLink(link.id);
   }

   function handleDeleteClick(link: Link, event: React.MouseEvent<HTMLButtonElement>) {
      if (event.shiftKey) {
         handleDelete(link);
         return;
      }

      setPendingDeleteLink(link);
   }

   async function handleDeleteConfirm() {
      if (!pendingDeleteLink) return;
      await handleDelete(pendingDeleteLink);
      setPendingDeleteLink(null);
   }

   return (
      <>
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
                        <div className="flex justify-end gap-2">
                           <Button size="icon" variant="outline" onClick={() => handleCopy(link)}>
                              {copiedLink === link.id ? <CopyCheck /> : <Copy />}
                           </Button>
                           <Button
                              size="icon"
                              variant="destructive"
                              disabled={isDeleting}
                              onClick={(event) => handleDeleteClick(link, event)}
                           >
                              <Trash2 />
                           </Button>
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <AlertDialog
            open={!!pendingDeleteLink}
            onOpenChange={(open) => !open && setPendingDeleteLink(null)}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete link?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action can{"'"}t be undone. This will permanently delete
                     {pendingDeleteLink?.code}.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     variant="destructive"
                     disabled={isDeleting}
                     onClick={handleDeleteConfirm}
                  >
                     {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
