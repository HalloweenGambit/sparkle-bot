import fs from 'fs/promises';
import path from 'path';
import process from 'process';
export const loadEventListeners = async (discordClient) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const eventListenerPath = path.resolve(__dirname, '../eventListeners');
    try {
        const eventListenerFiles = await fs.readdir(eventListenerPath);
        for (const file of eventListenerFiles) {
            const fileExtension = isDevelopment ? '.ts' : '.js';
            if (file.endsWith(fileExtension) &&
                !file.endsWith(`.test${fileExtension}`)) {
                const { default: eventListener } = await import(path.resolve(eventListenerPath, file));
                eventListener(discordClient);
                console.log(`Event listener ${file} loaded.`);
            }
        }
    }
    catch (err) {
        console.error(`Error loading event listeners: ${err.message}`);
    }
};
