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
import { Loader2 } from "lucide-react";

type DeleteLinkDialogProps = {
   whenVisible: boolean;
   isDeleting: boolean;
   currentLink: Link;
   onSubmit: () => void;
   onCancel: () => void;
}

export default function DeleteLinkDialog({
   whenVisible,
   isDeleting,
   currentLink,
   onCancel,
   onSubmit
}: DeleteLinkDialogProps) {
   return (
      <AlertDialog
         open={whenVisible}
         onOpenChange={(open) => !open && onCancel()}
      >
         <AlertDialogContent size="sm">
            <AlertDialogHeader>
               <AlertDialogTitle>Delete link?</AlertDialogTitle>
               <AlertDialogDescription>
                  This action can{"'"}t be undone. This will permanently delete{" "}
                  <span className="text-foreground">{currentLink.code}</span> which leads
                  to{" "}
                  <a href={currentLink.originalUrl}>{currentLink.originalUrl}.</a>
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
                  onClick={() => onSubmit()}
               >
                  {isDeleting ? (
                  <>
                     <Loader2 className="animate-spin" /> Deleting...
                  </>
                  ) : "Delete"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}