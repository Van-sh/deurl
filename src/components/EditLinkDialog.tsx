import { Loader2 } from "lucide-react";
import { type Link } from "~api/modules/links/links.models";
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
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";

type EditLinkDialogProps = {
   whenVisible: boolean;
   canEditCode: boolean;
   isEditing: boolean;
   currentLink: Link;
   onSubmit: () => void;
   onCancel: () => void;
   onSetDraft: (linkDraft: Link) => void;
}

export default function EditLinkDialog({
   whenVisible,
   canEditCode,
   isEditing,
   currentLink,
   onSetDraft,
   onSubmit,
   onCancel
}: EditLinkDialogProps) {
   return (
      <AlertDialog
            open={whenVisible}
            onOpenChange={(open) => !open && onCancel()}
         >
            <AlertDialogContent size="sm">
               <AlertDialogHeader>
                  <AlertDialogTitle>Edit Link</AlertDialogTitle>
                  <AlertDialogDescription className="w-full">
                     <Field>
                        <FieldLabel htmlFor="original-url">URL</FieldLabel>
                        <Input
                           id="original-url"
                           type="text"
                           value={currentLink.originalUrl}
                           onChange={(event) =>
                              onSetDraft({ ...currentLink, originalUrl: event.target.value })
                           }
                        />
                     </Field>
                  </AlertDialogDescription>
                  <AlertDialogDescription className="mt-4 text-start w-full">
                     <Field>
                        <FieldLabel htmlFor="link-code">Code</FieldLabel>
                        <Input
                           type="text"
                           value={currentLink.code}
                           onChange={(event) => onSetDraft({ ...currentLink, code: event.target.value }) }
                           disabled={!canEditCode}
                        />
                        {!canEditCode &&
                           <span className="text-slate-400 text-xs">Anonymous users cannot edit code.</span>
                        }
                     </Field>
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isEditing}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     autoFocus
                     variant="destructive"
                     disabled={isEditing}
                     onClick={onSubmit}
                  >
                     {isEditing ? (
                        <>
                           <Loader2 className="animate-spin" />
                           Updating...
                        </>
                     ) : (
                        "Update"
                     )}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
   )
}