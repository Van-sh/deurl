import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Copy, CopyCheck, ExternalLink, Loader2, Trash2, Pencil, Check, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { deleteLinkOptions, getAllLinkOptions, patchLinkOptions } from "~/query/link";
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
import { Input } from "./ui/input";
import { authClient } from "~/lib/auth-client";
import { Spinner } from "./ui/spinner";

export function LinksTable() {
   const queryClient = useQueryClient();
   const { data } = useSuspenseQuery(getAllLinkOptions);
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
                  <LinkTableRow link={link} onRequestDelete={(e) => handleDeleteClick(link, e)} />
               ))}
            </TableBody>
         </Table>
         <AlertDialog
            open={!!pendingDeleteLink}
            onOpenChange={(open) => !open && setPendingDeleteLink(null)}
         >
            <AlertDialogContent size="sm">
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete link?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action can{"'"}t be undone. This will permanently delete{" "}
                     <span className="text-foreground">{pendingDeleteLink?.code}</span> which leads
                     to{" "}
                     <a href={pendingDeleteLink?.originalUrl}>{pendingDeleteLink?.originalUrl}.</a>
                  </AlertDialogDescription>
                  <AlertDialogDescription className="mt-4 text-start">
                     <p className="font-medium text-green-700 dark:text-green-400">PROTIP: </p>
                     <span className="text-sm">
                        You can hold down Shift when clicking <b>delete link</b> to bypass this
                        confirmation entirely
                     </span>
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     autoFocus
                     variant="destructive"
                     disabled={isDeleting}
                     onClick={handleDeleteConfirm}
                  >
                     {isDeleting ? (
                        <>
                           <Loader2 className="animate-spin" />
                           Deleting...
                        </>
                     ) : (
                        "Delete"
                     )}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}

function LinkTableRow(props: {
   link: Link;
   onRequestDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
   const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
   const [copiedLink, setCopiedLink] = useState<number | undefined>(undefined);
   const [editing, setEditing] = useState(false);
   const [thisLink, setThisLink] = useState(props.link);
   const queryClient = useQueryClient();
   const session = authClient.useSession();
   
   const { mutateAsync: patchLink, isPending: isPatching } = useMutation(
      patchLinkOptions(
         () => {
            queryClient.invalidateQueries({ queryKey: getAllLinkOptions.queryKey });
            setEditing(false);
            toast.success("Link updated.");
         },
         (error) => {
            toast.error(error.message);
         },
      ),
   );
   
   async function handleEdit() {
      await patchLink({
         id: props.link.id,
         url: thisLink.originalUrl,
         customCode: session.data?.user.isAnonymous ? undefined : thisLink.code,
      });
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
      <TableRow key={props.link.id}>
      <TableCell className="max-w-xs truncate">
      {editing ? (
         <Input
         type="text"
         value={thisLink.originalUrl}
         onChange={(event) =>
            setThisLink(() => ({
               ...thisLink,
               originalUrl: event.target.value,
            }))
         }
         />
      ) : (
         <Button
         nativeButton={false}
         render={<a href={props.link.originalUrl} />}
         variant={"link"}
         className="text-foreground"
         >
         <ExternalLink />
         {props.link.originalUrl}
         </Button>
      )}
      </TableCell>
      <TableCell className="max-w-xs truncate">
      {editing && !session.data?.user.isAnonymous ? (
         <Input
         type="text"
         value={thisLink.code}
         onChange={(event) =>
            setThisLink(() => ({
               ...thisLink,
               code: event.target.value,
            }))
         }
         />
      ) : (
         <span className="w-full">{props.link.code}</span>
      )}
      </TableCell>
      <TableCell>{"clickCount" in props.link ? props.link.clickCount : "-"}</TableCell>
      <TableCell className="text-right">
      <div className="flex justify-end gap-2">
      {editing ? (
         <>
         <Button
         size="icon"
         variant="outline"
         onClick={() => handleEdit()}
         disabled={isPatching}
         >
         {isPatching ? <Spinner data-icon="inline-start" /> : <Check />}
         </Button>
         <Button size="icon" variant="destructive" onClick={() => setEditing(false)}>
         <X />
         </Button>
         </>
      ) : (
         <>
         <Button size="icon" variant="outline" onClick={() => setEditing(true)}>
         <Pencil />
         </Button>
         <Button size="icon" variant="outline" onClick={() => handleCopy(props.link)}>
         {copiedLink === props.link.id ? <CopyCheck /> : <Copy />}
         </Button>
         <Button
         size="icon"
         variant="destructive"
         // disabled={isDeleting}
         onClick={(event) => props.onRequestDelete(event)}
         >
         <Trash2 />
         </Button>
         </>
      )}
      </div>
      </TableCell>
      </TableRow>
   );
}
