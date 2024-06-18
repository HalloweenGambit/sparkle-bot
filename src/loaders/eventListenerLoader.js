import fs from "fs/promises";
import path from "path";

export const loadEventListeners = async (
  discordClient,
  dbClient,
  gptClient
) => {
  const eventListenerPath = path.resolve(
    new URL(".", import.meta.url).pathname,
    "../bot/eventListeners"
  );
  const eventListenerFiles = await fs.readdir(eventListenerPath);

  for (const file of eventListenerFiles) {
    if (file.endsWith(".js") && !file.endsWith(".test.js")) {
      const { default: eventListener } = await import(
        path.resolve(eventListenerPath, file)
      );
      eventListener(discordClient, dbClient, gptClient);
      console.log(`Event listener ${file} loaded.`);
    }
  }
};
