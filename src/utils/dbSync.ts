import { guildChannelPromises } from './channel'
import { formatGuilds, loadCompleteGuilds, syncGuilds } from './utils'

//! make sure to be able to differentiate between an error and null
export const dbSync = async () => {
  console.log('dbSync Started')
  const allGuilds = await loadCompleteGuilds()
  const formattedGuilds = formatGuilds(allGuilds)

  // Sync guilds
  await syncGuilds(formattedGuilds)

  // Process each guild and collect promises for channel operations
  const channelPromises = allGuilds.map(async (guild) => {
    const { newChannels, modifiedChannels, unchangedChannels } =
      await guildChannelPromises(guild)

    console.log(
      `Guild ${guild.id}: newChannels: ${newChannels.length}, modifiedChannels: ${modifiedChannels.length}, unchangedChannels: ${unchangedChannels.length}`
    )

    return { newChannels, modifiedChannels, unchangedChannels }
  })

  // Wait for all guild channel promises to resolve
  const channelResults = await Promise.all(channelPromises)

  // Collect all new and modified channel promises for final resolution
  const allNewChannelPromises = channelResults.flatMap(
    (result) => result.newChannels
  )
  const allModifiedChannelPromises = channelResults.flatMap(
    (result) => result.modifiedChannels
  )

  // Resolve all new and modified channel promises
  await Promise.all([...allNewChannelPromises, ...allModifiedChannelPromises])

  // Log the results
  const totalNewChannels = allNewChannelPromises.length
  const totalModifiedChannels = allModifiedChannelPromises.length
  const totalUnchangedChannels = channelResults.reduce(
    (total, result) => total + result.unchangedChannels.length,
    0
  )

  console.log(`Total new channels: ${totalNewChannels}`)
  console.log(`Total modified channels: ${totalModifiedChannels}`)
  console.log(`Total unchanged channels: ${totalUnchangedChannels}`)
}
