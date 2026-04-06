import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { deleteLinkOptions, getAllLinkOptions, editLinkOptions } from "~/query/link";
import type { Link } from "~api/modules/links/links.models";
import DeleteLinkDialog from "./DeleteLinkDialog";
import EditLinkDialog from "./EditLinkDialog";
import LinksTableRow from "./LinksTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

export function LinksTable() {
   const queryClient = useQueryClient();
   const session = authClient.useSession();
   const { data } = useSuspenseQuery(getAllLinkOptions);
   const [pendingDeleteLink, setPendingDeleteLink] = useState<Link | null>(null);
   const [linkToEdit, setLinkToEdit] = useState<Link | null>(null);

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

   const { mutate: editLink, isPending: isEditing } = useMutation(
      editLinkOptions(
         () => {
            queryClient.invalidateQueries({ queryKey: getAllLinkOptions.queryKey });
            setLinkToEdit(null);
            toast.success("Link updated.");
         },
         (error) => {
            toast.error(error.message);
         },
      ),
   );

   function handleEdit() {
      if (!linkToEdit) return;

      editLink({
         id: linkToEdit.id,
         url: linkToEdit.originalUrl,
         customCode: session.data && !session.data.user.isAnonymous ? linkToEdit.code : undefined,
      });
   }

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
                  <LinksTableRow
                     key={link.id}
                     link={link}
                     editingThisLink={linkToEdit?.id === link.id}
                     deletingThisLink={pendingDeleteLink?.id === link.id}
                     onRequestDelete={(e) => handleDeleteClick(link, e)}
                     onRequestEdit={() => setLinkToEdit(link)}
                  />
               ))}
            </TableBody>
         </Table>

         {pendingDeleteLink && (
            <DeleteLinkDialog
               open={!!pendingDeleteLink}
               currentLink={pendingDeleteLink}
               isDeleting={isDeleting}
               onCancel={() => setPendingDeleteLink(null)}
               onSubmit={handleDeleteConfirm}
            />
         )}

         {linkToEdit && (
            <EditLinkDialog
               open={!!linkToEdit}
               currentLink={linkToEdit}
               isEditing={isEditing}
               canEditCode={!!session.data && !session.data.user.isAnonymous}
               onSetDraft={setLinkToEdit}
               onSubmit={handleEdit}
               onCancel={() => setLinkToEdit(null)}
            />
         )}
      </>
   );
}
