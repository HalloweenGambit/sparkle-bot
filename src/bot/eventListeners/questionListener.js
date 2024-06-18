// src/bot/eventListeners/questionListener.js
import { handleMessageCreate } from "./handlers/handlers.js";

export default function questionListener(discordClient, dbClient, gptClient) {
  discordClient.on("messageCreate", (message) =>
    handleMessageCreate(message, dbClient, gptClient)
  );
}
