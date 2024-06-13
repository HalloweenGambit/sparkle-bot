import fs from "fs/promises";
import path from "path";

export const loadEventListeners = async (discordClient, dbClient, heyDoc) => {
  const eventListenerPath = path.resolve(
    new URL(".", import.meta.url).pathname,
    "../bot/eventListeners"
  );
  const eventListenerFiles = await fs.readdir(eventListenerPath);

  for (const file of eventListenerFiles) {
    if (file.endsWith(".js")) {
      const { default: eventListener } = await import(
        path.resolve(eventListenerPath, file)
      );
      eventListener(discordClient, dbClient, heyDoc);
      console.log(`Event listener ${file} loaded.`);
    }
  }
};
