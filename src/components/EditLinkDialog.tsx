import type { Link } from "~api/modules/links/links.models";
import { Button } from "./ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

type EditLinkDialogProps = {
   open: boolean;
   canEditCode: boolean;
   isEditing: boolean;
   currentLink: Link | null;
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
         <DialogContent>
            {currentLink && (
               <form onSubmit={onSubmit}>
                  <DialogHeader>
                     <DialogTitle>Edit Link</DialogTitle>
                  </DialogHeader>
                  <FieldGroup className="gap-3 py-4">
                     <Field>
                        <FieldLabel htmlFor="original-url">URL</FieldLabel>
                        <Input
                           autoFocus
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
                           onChange={(event) =>
                              onSetDraft({ ...currentLink, code: event.target.value })
                           }
                           disabled={!canEditCode}
                        />
                        {!canEditCode && (
                           <span className="text-xs text-slate-400">
                              Anonymous users cannot edit code.
                           </span>
                        )}
                     </Field>
                  </FieldGroup>

                  <DialogFooter>
                     <DialogClose
                        disabled={isEditing}
                        render={<Button variant="outline">Close</Button>}
                     />
                     <Button variant="default" disabled={isEditing} type="submit">
                        {isEditing && <Spinner />}
                        Update
                     </Button>
                  </DialogFooter>
               </form>
            )}
         </DialogContent>
      </Dialog>
   );
}
