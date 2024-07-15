import { compareGuilds, findGuild, formatGuild, formatGuilds, getChangedFields, loadCompleteGuilds, loadGuilds, } from '../../utils/guildUtils.js';
import dbClient from '../../config/dbConfig.js';
import { Servers } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
export const createGuild = async (guild) => {
    try {
        const formattedGuild = formatGuild(guild);
        const db = await dbClient;
        // Insert the new guild into the database
        const res = await db.insert(Servers).values(formattedGuild).returning();
        // If no result, return an error
        if (!res || res.length === 0) {
            console.error('Insert operation did not return any results');
            return { error: 'Failed to create guild. No result returned.' };
        }
        return res[0]; // Assuming res is an array and we need to return the first inserted guild
    }
    catch (error) {
        console.error('Error creating guild:', error);
        return { error: 'Failed to create guild. Please try again later.' };
    }
};
// TODO: return the changed {key:property} and correct type
export const updateGuild = async (guild) => {
    try {
        const newGuild = await formatGuild(guild);
        const foundGuild = await findGuild(guild.id);
        if (!foundGuild) {
            return;
        }
        let db = await dbClient;
        // Get the fields that have changed
        const changedFields = getChangedFields(guild, foundGuild);
        // Perform the update in the database
        await db
            .update(Servers)
            .set(changedFields)
            .where(eq(Servers.discordId, foundGuild.discordId));
        console.log(`Updated guild: ${foundGuild.id}, ${foundGuild.guildName}`);
    }
    catch (error) {
        console.error(`Error updating guild ${guild.id}:`, error);
    }
};
export const deleteGuild = async (guildId) => {
    try {
        const foundGuild = await findGuild(guildId);
        if (!foundGuild) {
            return;
        }
        let db = await dbClient;
        await db
            .update(Servers)
            .set({ isActive: false })
            .where(eq(Servers.discordId, guildId));
        console.log(`guild: ${foundGuild.id}, ${foundGuild.guildName} has been marked as inactive :(`);
    }
    catch (error) {
        console.error(`Error deleting guild ${guildId}:`, error);
    }
};
//! make sure to be able to differentiate between an error and null
export const syncGuilds = async () => {
    console.log('Started syncing guilds');
    const guilds = await loadGuilds();
    const completeGuilds = await loadCompleteGuilds();
    const newData = await formatGuilds(completeGuilds);
    const newGuilds = [];
    const modifiedGuilds = [];
    const unchangedGuilds = [];
    try {
        // Process each guild in newData
        for (const guild of completeGuilds) {
            const found = await findGuild(guild.id);
            if (!found) {
                // Guild not found in database, create new guild
                newGuilds.push(createGuild(guild));
            }
            else if (!compareGuilds(guild, found)) {
                // Guild found but data differs, update guild
                modifiedGuilds.push(updateGuild(guild));
            }
            else {
                // Guild found and data matches, consider it unchanged
                unchangedGuilds.push(guild);
                // console.log(`Unchanged guild: ${guild.discordId}`)
            }
        }
        // Wait for all new guilds and updates to complete
        await Promise.all([...newGuilds, ...modifiedGuilds]);
        console.log(`new guilds: ${newGuilds.length}, modified guilds: ${modifiedGuilds.length}, unchanged guilds: ${unchangedGuilds.length}`);
    }
    catch (error) {
        console.error('Error syncing guilds:', error);
        throw error;
    }
};
