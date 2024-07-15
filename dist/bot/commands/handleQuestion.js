import embedMessageContent from '../services/embedMessageContent';
import { formatQuestion } from '../../utils/messagesUtils';
import { saveQuestion, saveQuestionEmbedding, } from '../services/questionService';
import queryMessageDatabase from '../services/queryMessageDatabase';
import dbClient from '../../config/dbConfig';
import { eq } from 'drizzle-orm';
import { Messages } from '../../db/schema';
export async function handleQuestion(message) {
    if (message.author.bot) {
        return;
    }
    const content = message.content;
    const containsQuestionMark = (str) => {
        const regex = /\?/;
        return regex.test(str);
    };
    if (!containsQuestionMark(content)) {
        return;
    }
    try {
        console.log(`start handling question: ${content}`);
        console.log(`started formatting question`);
        const formattedQuestion = await formatQuestion(message);
        console.log(`finished formatting question`);
        console.log(`saving question`);
        saveQuestion(formattedQuestion);
        console.log(`finished saving question`);
        const { discordId, tokens } = formattedQuestion;
        console.log(`embedding message content`);
        const embedding = await embedMessageContent(tokens);
        console.log(`finished embedding message content`);
        console.log(`saving question embedding`);
        saveQuestionEmbedding(discordId, embedding);
        console.log(`finished saving question embedding`);
        // top 5 possiblt results
        const res = await queryMessageDatabase(embedding);
        // return the first best result
        const firstResult = res[0];
        const messageId = firstResult.messageId;
        const db = await dbClient;
        console.log(`searching for message with id: ${messageId}`);
        const answer = await db.query.Messages.findFirst({
            where: eq(Messages.discordId, messageId),
        });
        console.log(`found message with id: ${messageId}`);
        if (!answer) {
            return;
        }
        message.reply(`I think this might help: ${messageId}
    ${answer?.content}
    `);
    }
    catch (error) {
        console.error(error);
    }
    // TODO: use an llm to query the top 5 results and evaluate them. return the best.
    // console.log(result)
    return;
}
