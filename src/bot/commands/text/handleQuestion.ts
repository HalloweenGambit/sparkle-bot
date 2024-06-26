export async function handleQuestion(message) {
  const content = message.content;
  const guildId = message.guildId;
  const channelId = message.channelId;
  const createdAt = message.createdAt;

  const containsQuestionMark = (str) => {
    const regex = /\?/;
    return regex.test(str);
  };

  if (!containsQuestionMark(content)) {
    return false;
  }

  console.log(content);
  return;
}
