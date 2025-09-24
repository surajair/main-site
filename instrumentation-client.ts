// instrumentation-client.ts
import { initBotId } from "botid/client/core";

// Your protected routes configuration
initBotId({
  protect: [
    {
      path: "/login",
      method: "POST",
    },
    {
      path: "/signup",
      method: "POST",
    },
    {
      path: "/reset-password",
      method: "POST",
    },
    {
      path: "/forgot-password",
      method: "POST",
    },
  ],
});
