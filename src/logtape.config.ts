import "@tanstack/react-start/server-only";

import { AsyncLocalStorage } from "node:async_hooks";

import { ansiColorFormatter, configure, getConsoleSink } from "@logtape/logtape";

import { env } from "./env";

if (env.NODE_ENV === "production") {
   await configure({
      sinks: { console: getConsoleSink() },
      loggers: [
         {
            category: ["logtape"],
            sinks: ["console"],
            lowestLevel: "warning",
         },
         {
            category: ["server"],
            sinks: ["console"],
            lowestLevel: "info",
         },
      ],
      contextLocalStorage: new AsyncLocalStorage(),
   });
} else {
   await configure({
      sinks: { console: getConsoleSink({ formatter: ansiColorFormatter }) },
      loggers: [
         { category: ["logtape"], sinks: ["console"], lowestLevel: null },
         {
            category: ["server"],
            sinks: ["console"],
            lowestLevel: env.LOG_LEVEL ?? "trace",
         },
      ],
      contextLocalStorage: new AsyncLocalStorage(),
      reset: true,
   });
}
