import { handleQuestion } from '../commands/handleQuestion.js';
import { handleHeyDoc } from '../commands/handleHeyDoc.js';
export default (client) => {
    client.on('messageCreate', async (message) => {
        console.log(message.content);
        handleQuestion(message);
        handleHeyDoc(message);
    });
};
