import { handleQuestion } from "../commands/text/handleQuestion";
<<<<<<< HEAD
=======

>>>>>>> f7f077b
const regex = /^hey doc/i;

export default (client) => {
  client.on("messageCreate", async (message, dbClient, gptClient) => {
    if (regex.test(message.content)) {
      console.log("I was summoned");
      console.log(message);
      message.reply("hello");
    }

<<<<<<< HEAD
    handleQuestion(message, dbClient, gptClient);
=======
    handleQuestion(message);
>>>>>>> f7f077b
  });
};
