import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Prettify } from "elysia/types";

import { api, type Api } from "~/lib/api";

export const getAllLinkOptions = queryOptions({
   queryKey: ["getAllLinks"],
   async queryFn() {
      const { data, error } = await api().links.get();
      if (error) {
         throw new Error(error.value.detail);
      }

      return data;
   },
});

type CreateLinkInput = Parameters<Api["links"]["post"]>[0];
export const createLinkOptions = (onSuccess: () => void, onError: (error: Error) => void) =>
   mutationOptions({
      mutationFn: async ({ url, customCode }: CreateLinkInput) => {
         const payload = customCode ? { url, customCode } : { url };
         const { data, error } = await api().links.post(payload);

         if (error) {
            switch (error.status) {
               case 401:
               case 403:
               case 422:
                  throw new Error(error.value.detail);
               default:
                  console.log(
                     `Unknown Error Code while creating the link: ${error satisfies never}`,
                  );
                  throw new Error("Something went wrong while creating the link.");
            }
         }

         return data;
      },
      onSuccess,
      onError,
   });

type EditLinkInput = Prettify<
   Parameters<Api["links"]>[0] & Parameters<ReturnType<Api["links"]>["patch"]>[0]
>;
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
               case 422:
                  throw new Error(error.value.detail);
               default:
                  console.log(
                     `Unknown Error Code while updating the link: ${error satisfies never}`,
                  );
                  throw new Error("Something went wrong while updating data.");
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
               case 422:
                  throw new Error(error.value.detail);
               default:
                  console.log(
                     `Unknown Error Code while deleting the link: ${error satisfies never}`,
                  );
                  throw new Error("Something went wrong while deleting the link.");
            }
         }

         return data;
      },
      onSuccess,
      onError,
   });
