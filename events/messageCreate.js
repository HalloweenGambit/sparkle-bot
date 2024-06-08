const regex = /^hey doc/i;
client.on("messageCreate", async (message) => {
  if (regex.test(message.content)) {
    console.log("I was summoned");
    console.log(message);
    message.reply("hello");
  }
});
