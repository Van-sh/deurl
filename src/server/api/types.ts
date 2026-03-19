import type { StatusMap } from "elysia";
import type { AnySchema } from "elysia/types";

export type ResponseSchema = Partial<Record<StatusMap[keyof StatusMap], AnySchema>>;
