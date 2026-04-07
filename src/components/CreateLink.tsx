import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useId, useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { createLinkOptions, getAllLinkOptions } from "~/query/link";
import { Button } from "./ui/button";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

export default function CreateLink() {
   const queryClient = useQueryClient();
   const session = authClient.useSession();

   const urlInputId = useId();
   const customCodeInputId = useId();

   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
   const [url, setUrl] = useState("");
   const [customCode, setCustomCode] = useState("");

   const { mutateAsync: createLink, isPending: isCreating } = useMutation(
      createLinkOptions(
         () => {
            queryClient.invalidateQueries({ queryKey: getAllLinkOptions.queryKey });
            setUrl("");
            setCustomCode("");
            setIsCreateDialogOpen(false);
            toast.success("URL successfully created");
         },
         (error) => {
            toast.error(error.message);
         },
      ),
   );

   async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();

      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
         toast.error("URL is required.");
         return;
      }

      try {
         new URL(trimmedUrl);
      } catch {
         toast.error("Please enter a valid URL.");
         return;
      }

      const trimmedCustomCode = customCode.trim();

      await createLink({
         url: trimmedUrl,
         customCode: trimmedCustomCode || undefined,
      });
   }

   return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
         <DialogTrigger render={<Button />}>
            <Plus /> Create
         </DialogTrigger>

         <DialogContent>
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Create short link</DialogTitle>
               </DialogHeader>
               <FieldGroup className="gap-3 py-4">
                  <Field>
                     <FieldLabel htmlFor={urlInputId}>URL</FieldLabel>
                     <Input
                        id={urlInputId}
                        type="url"
                        autoComplete="off"
                        placeholder="https://example.com/some/long/link"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        required
                     />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor={customCodeInputId}>Custom code</FieldLabel>
                     <Input
                        id={customCodeInputId}
                        autoComplete="off"
                        placeholder="my-link"
                        value={customCode}
                        onChange={(event) => setCustomCode(event.target.value)}
                        disabled={session.data?.user.isAnonymous ?? true}
                     />
                  </Field>
               </FieldGroup>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => setIsCreateDialogOpen(false)}
                     disabled={isCreating}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                     {isCreating && <Spinner />}
                     Create
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
