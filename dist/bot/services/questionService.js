import dbClient from '../../config/dbConfig.js';
import { MessageEmbeddings, QuestionEmbeddings, Questions, } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
export const saveQuestion = async (question) => {
    const db = await dbClient;
    await db.insert(Questions).values(question);
};
export const updateQuestion = async () => { };
export const deleteQuestion = async () => { };
// TODO: Implement an update and delete function
export const saveQuestionEmbedding = async (discordId, embedding) => {
    if (!embedding) {
        return;
    }
    try {
        const db = await dbClient;
        await db.insert(QuestionEmbeddings).values({
            discordId,
            embedding,
        });
        console.log(`Saved embedding for message ${discordId}`);
    }
    catch (error) {
        console.log(`Error saving message embedding: ${error}`);
        throw { error: 'Failed saving embedding. Please try again later.' };
    }
};
export const updateQuestionEmbedding = async (messageId, embedding) => {
    if (!embedding) {
        return;
    }
    try {
        const db = await dbClient;
        const res = await db
            .update(MessageEmbeddings)
            .set({ embedding: embedding })
            .where(eq(MessageEmbeddings.discordId, messageId));
        console.log(`Updated embedding for message ${messageId}`);
        return res;
    }
    catch (error) {
        console.error(`Error updating message embedding: ${error}`);
        throw { error: 'Failed updating embedding. Please try again later.' };
    }
};
export const deleteQuestionEmbedding = async (messageId) => {
    try {
        const db = await dbClient;
        await db
            .delete(MessageEmbeddings)
            .where(eq(MessageEmbeddings.discordId, messageId));
        console.log(`Deleted embedding for message ${messageId}`);
    }
    catch (error) {
        console.error(`Error deleting message embedding: ${error}`);
        throw { error: 'Failed deleting embedding. Please try again later.' };
    }
};
