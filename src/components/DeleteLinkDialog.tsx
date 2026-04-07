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
import { Spinner } from "./ui/spinner";

type DeleteLinkDialogProps = {
   open: boolean;
   isDeleting: boolean;
   currentLink: Link | null;
   onSubmit: () => void;
   onCancel: () => void;
};

export default function DeleteLinkDialog({
   open,
   isDeleting,
   currentLink,
   onCancel,
   onSubmit,
}: DeleteLinkDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && !isDeleting && onCancel()}>
         <AlertDialogContent size="sm">
            <AlertDialogHeader>
               <AlertDialogTitle>Delete link?</AlertDialogTitle>
               {currentLink && (
                  <AlertDialogDescription>
                     This action can{"'"}t be undone. This will permanently delete{" "}
                     <span className="text-foreground">{currentLink.code}</span> which leads to{" "}
                     <a href={currentLink.originalUrl}>{currentLink.originalUrl}.</a>
                  </AlertDialogDescription>
               )}
               <AlertDialogDescription className="mt-4 text-start">
                  <span className="font-medium text-green-700 dark:text-green-400">PROTIP: </span>
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
                  onClick={onSubmit}
               >
                  {isDeleting ? (
                     <>
                        <Spinner /> Deleting...
                     </>
                  ) : (
                     "Delete"
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
