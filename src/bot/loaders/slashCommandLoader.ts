import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { Collection } from 'discord.js'

export const loadSlashCommands = async (discordClient) => {
  discordClient.commands = new Collection()

  const isDevelopment = process.env.NODE_ENV !== 'production'
  const fileExtension = isDevelopment ? '.ts' : '.js'

  const __dirname = path.dirname(new URL(import.meta.url).pathname)
  const commandsPath = path.resolve(__dirname, '../commands/slash')

  try {
    const commandFiles = await fs.readdir(commandsPath)
    for (const file of commandFiles) {
      if (
        file.endsWith(fileExtension) &&
        !file.endsWith(`.test${fileExtension}`)
      ) {
        const filePath = path.resolve(commandsPath, file)
        const { default: command } = await import(filePath)

        if (command.data && command.execute) {
          discordClient.commands.set(command.data.name, command)
          console.log(`Slash command ${file} loaded.`)
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          )
        }
      }
    }
  } catch (err) {
    console.error(`Error loading slash commands: ${err.message}`)
  }
}
