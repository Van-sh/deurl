import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Prettify } from "elysia/types";

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

type EditLinkInput = {
   id: number;
   url: string;
   customCode?: string;
};

type CreateLinkInput = Prettify<Omit<EditLinkInput, "id">>;

export const createLinkOptions = (onSuccess: () => void, onError: (error: Error) => void) =>
   mutationOptions({
      mutationFn: async ({ url, customCode }: CreateLinkInput) => {
         const payload = customCode ? { url, customCode } : { url };
         const { data, error } = await api().links.post(payload);

         if (error) {
            switch (error.status) {
               case 401:
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

export const deleteLinkOptions = (onSuccess: () => void, onError: (error: Error) => void) =>
   mutationOptions({
      mutationFn: async (linkId: number) => {
         const { data, error } = await api().links({ id: linkId }).delete();

         if (error) {
            switch (error.status) {
               case 401:
                  throw new Error(error.value.message);
               default:
                  throw new Error("Something went wrong while deleting the link.");
            }
         }

         return data;
      },
      onSuccess,
      onError,
   });

export const editLinkOptions = (onSuccess: () => void, onError: (error: Error) => void) =>
   mutationOptions({
      mutationFn: async (linkData: EditLinkInput) => {
         const { data, error } = await api().links({ id: linkData.id }).patch({
            url: linkData.url,
            customCode: linkData.customCode,
         });

         if (error) {
            switch (error.status) {
               case 401:
               case 403:
                  throw new Error(error.value.message);
               case 422:
                  throw new Error(error.value.summary);
               default:
                  throw new Error("Something went wrong while updating data.");
            }
         }

         return data;
      },
      onSuccess,
      onError,
   });
