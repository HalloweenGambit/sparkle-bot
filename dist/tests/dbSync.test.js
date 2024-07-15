// tests/initialize.test.ts
import { describe, it, beforeAll } from 'vitest';
import { loadCompleteGuilds, formatGuilds, } from '../utils/guildUtils';
import DotenvFlow from 'dotenv-flow';
import { formatGuildChannels, loadGuildChannels, syncAllChannels, } from '../utils/channelUtils';
import { syncGuilds } from '../bot/services/guildService';
DotenvFlow.config();
beforeAll(() => { });
describe.skip('test channels sync', async () => {
    it.skip('load guilds', async () => {
        const allGuilds = await loadCompleteGuilds();
        const formattedGuilds = await formatGuilds(allGuilds);
        await syncGuilds();
    });
    it('load', async () => {
        const guilds = await loadCompleteGuilds();
        const testGuild = guilds[0];
        const guildChannels = await loadGuildChannels(testGuild);
        const formattedChannels = await formatGuildChannels(guildChannels);
        await syncAllChannels();
    });
    it('format all channels', async () => { });
    it('checks all guilds against database', async () => { });
    it.todo('format guild', async () => { });
    it.todo('format guild', async () => { });
});
