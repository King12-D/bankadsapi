import buildServer from "./app-setup";
import { getOrThrowEnv } from "./config/config";

const startServer = async () => {
  try {
    const app = await buildServer();
    const port = Number(getOrThrowEnv.PORT);
    Bun.serve({
      port,
      fetch: app.fetch,
    });
    console.log(`Server is running on port ${port}`);
  } catch (error: any) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
