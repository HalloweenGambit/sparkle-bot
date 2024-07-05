import {
  Channel,
  Guild,
  GuildBasedChannel,
  Message,
  TextChannel,
} from 'discord.js'
import dbClient from '../config/dbConfig'
import { FormattedPinnedMessage } from '../types'

export const loadPinneGuildMessages = async (guildId: string) => {
  try {
    let db = await dbClient
    if (channel.isTextBased()) {
      const pinnedMessages = await channel.messages.fetchPinned()
    }
  } catch (error) {
    console.error(
      `Error fetching pinned messages for channel: ${channel.id}`,
      error
    )
    throw {
      error: 'Failed fetching pinned messages. Please try again later.',
    }
  }
}

export const formatPinnedMessages = (message): FormattedPinnedMessage => {
  return {
    discordId: message.id,
    channelId: message.channelId,
    guildId: message.guildId,
    authorId: message.authorId,
    content: message.content,
    attachments: [
      message.attachments.url,
      message.attachments.proxyUrl,
      message.attachments.filename,
      message.attachments.size,
      message.attachments.contentType,
      message.attachments.createdAt,
    ],
    embeds: message.embeds,
    discordCreatedAt: message.createdAt,
    pinnedAt: message.pinnedAt,
    stickers: message.stickers,
  }
}
