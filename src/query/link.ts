import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { api } from "~/lib/api";

export const getAllLinkOptions = queryOptions({
   queryKey: ["getAllLinks"],
   async queryFn() {
      const { data, error } = await api().links.get();
      if (error) {
         switch (error.status) {
            case 401:
               throw new Error(error.value.message);
            case 422:
               throw new Error(error.value.summary);
         }
      }

      return data;
   },
});

export const createLinkOptions = (onSuccess: () => void, onError: (error: Error) => void) =>
   mutationOptions({
      mutationFn: async (url: string) => {
         const { data, error } = await api().links.post({ url });

         if (error) {
            switch (error.status) {
               case 401:
                  throw new Error(error.value.message);
               case 403:
                  throw new Error(error.value.message);
               case 422:
                  throw new Error(error.value.summary);
               default:
                  throw new Error("Something went wrong while creating the link.");
            }
         }

         return data;
      },
      onSuccess,
      onError,
   });
