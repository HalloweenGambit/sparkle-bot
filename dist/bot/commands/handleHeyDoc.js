import geminiPro from '../../config/geminiPro.js';
export const handleHeyDoc = async (message) => {
    const regex = /^hey doc/i;
    if (regex.test(message.content)) {
        console.log('I was summoned');
        const docRes = await geminiPro(message.content);
        if (!docRes) {
            return;
        }
        for (const res of docRes) {
            await message.reply(res);
        }
    }
};
