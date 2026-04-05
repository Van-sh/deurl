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

type EditLinkDialogProps = {
   whenVisible: boolean;
   canEditCode: boolean;
   isPatching: boolean;
   currentLink: Link;
   onSubmit: () => void;
   onCancel: () => void;
   onSetDraft: (linkDraft: Link) => void;
}

export default function EditLinkDialog({
   whenVisible,
   canEditCode,
   isPatching,
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
                  <AlertDialogDescription>
                     <Input
                        type="text"
                        value={currentLink.originalUrl}
                        onChange={(event) =>
                           onSetDraft({ ...currentLink, originalUrl: event.target.value })
                        }
                     />
                  </AlertDialogDescription>
                  <AlertDialogDescription className="mt-4 text-start">
                     {canEditCode ? (
                        <Input
                           type="text"
                           value={currentLink.code}
                           onChange={(event) => onSetDraft({ ...currentLink, code: event.target.value }) }
                        />
                     ) : (
                        <span className="w-full">{currentLink.code}</span>
                     )}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPatching}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     autoFocus
                     variant="destructive"
                     disabled={isPatching}
                     onClick={onSubmit}
                  >
                     {isPatching ? (
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