// src/bot/eventListeners/questionListener.js
import { handleMessageCreate } from "../commands/question.js";

export default function questionListener(discordClient, dbClient, gptClient) {
  discordClient.on("messageCreate", (message) =>
    handleMessageCreate(message, dbClient, gptClient)
  );
}
