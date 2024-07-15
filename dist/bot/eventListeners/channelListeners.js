import { createChannel, deleteChannel, } from '../services/channelService';
export default (client) => {
    client.on('channelCreate', async (channel) => {
        createChannel(channel);
        console.log(`channel ${channel.name} created on ${channel.guildId}`);
    });
    client.on('channelUpdate', async (channel) => {
        // updateChannel(channel)
        console.log(channel);
    });
    client.on('channelDelete', async (channel) => {
        deleteChannel(channel.id);
    });
};
