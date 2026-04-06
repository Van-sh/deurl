import { type Link } from "~api/modules/links/links.models";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

type EditLinkDialogProps = {
   open: boolean;
   canEditCode: boolean;
   isEditing: boolean;
   currentLink: Link;
   onSubmit: () => void;
   onCancel: () => void;
   onSetDraft: (linkDraft: Link) => void;
};

export default function EditLinkDialog({
   open,
   canEditCode,
   isEditing,
   currentLink,
   onSetDraft,
   onSubmit,
   onCancel,
}: EditLinkDialogProps) {
   return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
         <DialogContent className="text-sm">
            <DialogTitle>Edit Link</DialogTitle>
            <div className="flex w-full flex-col gap-4">
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

               <Field>
                  <FieldLabel htmlFor="link-code">Code</FieldLabel>
                  <Input
                     type="text"
                     value={currentLink.code}
                     onChange={(event) => onSetDraft({ ...currentLink, code: event.target.value })}
                     disabled={!canEditCode}
                  />
                  {!canEditCode && (
                     <span className="text-xs text-slate-400">
                        Anonymous users cannot edit code.
                     </span>
                  )}
               </Field>
            </div>

            <DialogFooter>
               <DialogClose
                  disabled={isEditing}
                  render={<Button variant="outline">Close</Button>}
               />
               <Button autoFocus variant="destructive" disabled={isEditing} onClick={onSubmit}>
                  {isEditing ? (
                     <>
                        <Spinner />
                        Updating...
                     </>
                  ) : (
                     "Update"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
