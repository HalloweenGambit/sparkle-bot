import { handleQuestion } from '../commands/handleQuestion';
import { handleHeyDoc } from '../commands/handleHeyDoc';
export default (client) => {
    client.on('messageCreate', async (message) => {
        console.log(message.content);
        handleQuestion(message);
        handleHeyDoc(message);
    });
};
