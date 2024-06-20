import { handleQuestion } from "../commands/text/handleQuestion";

const regex = /^hey doc/i;

export default (client) => {
  client.on("messageCreate", async (message, dbClient, gptClient) => {
    if (regex.test(message.content)) {
      console.log("I was summoned");
      console.log(message);
      message.reply("hello");
    }

    handleQuestion(message, dbClient, gptClient);
  });
};
