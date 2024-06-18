// src/bot/eventListeners/questionListener.js
import { handleQuestion } from "../commands/text/handleQuestion.ts";

export default function questionListener(discordClient, dbClient, gptClient) {
  discordClient.on("messageCreate", (message) =>
    handleQuestion(message, dbClient, gptClient)
  );
}
