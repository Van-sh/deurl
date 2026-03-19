import { ansiColorFormatter, configure, getConsoleSink } from "@logtape/logtape";

import { env } from "./env";

await configure({
   sinks: {
      console: getConsoleSink({ formatter: ansiColorFormatter }),
   },
   loggers: [
      { category: ["logtape"], sinks: [] },
      {
         category: ["server"],
         sinks: ["console"],
         lowestLevel: env.VITE_LOG_LEVEL,
      },
   ],
   reset: env.NODE_ENV === "development",
});
