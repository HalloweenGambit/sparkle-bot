import { Message } from "discord.js";

export async function handleQuestion(message: Message) {
  const content = message.content;
  const guildId = message.guildId;
  const channelId = message.channelId;
  const createdAt = message.createdAt;

  const containsQuestionMark = (str: string) => {
    const regex = /\?/;
    return regex.test(str);
  };

  if (!containsQuestionMark(content)) {
    return false;
  }

  console.log(content);
  return;
}
