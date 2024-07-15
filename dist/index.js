import DotenvFlow from "dotenv-flow";
import fs from "fs/promises";
import path from "path";
import { Collection, Client, GatewayIntentBits } from "discord.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql, eq } from "drizzle-orm";
import { pgTable, serial, varchar, integer, boolean, timestamp, text, vector, index } from "drizzle-orm/pg-core";
const loadEventListeners = async (discordClient2) => {
  const eventListenerPath = path.resolve(
    new URL(".", import.meta.url).pathname,
    "../eventListeners"
  );
  const eventListenerFiles = await fs.readdir(eventListenerPath);
  for (const file of eventListenerFiles) {
    if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
      const { default: eventListener } = await import(path.resolve(eventListenerPath, file));
      eventListener(discordClient2);
      console.log(`Event listener ${file} loaded.`);
    }
  }
};
const loadSlashCommands = async (discordClient2) => {
  discordClient2.commands = new Collection();
  const commandsPath = path.resolve(
    new URL(".", import.meta.url).pathname,
    "../commands/slash"
  );
  const commandFiles = await fs.readdir(commandsPath);
  for (const file of commandFiles) {
    if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
      const filePath = path.resolve(commandsPath, file);
      const { default: command } = await import(filePath);
      if (command.data && command.execute) {
        discordClient2.commands.set(command.data.name, command);
        console.log(`Slash command ${file} loaded.`);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
};
var define_process_env_default$2 = { NODE_ENV: "development", NVM_INC: "/Users/gamb1t/.nvm/versions/node/v21.6.1/include/node", MANPATH: "/Users/gamb1t/.nvm/versions/node/v21.6.1/share/man:/opt/homebrew/share/man:/usr/share/man:/usr/local/share/man:/Users/gamb1t/.nvm/versions/node/v21.6.1/share/man:/opt/homebrew/share/man::", TERM_PROGRAM: "vscode", NODE: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin/node", INIT_CWD: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/dist", _P9K_TTY: "/dev/ttys003", NVM_CD_FLAGS: "-q", TERM: "xterm-256color", SHELL: "/bin/zsh", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/9m/qv1zhl4j2r7_znd3vd8kx2yw0000gn/T/", npm_config_global_prefix: "/Users/gamb1t/.nvm/versions/node/v21.6.1", TERM_PROGRAM_VERSION: "1.91.1", ZDOTDIR: "/Users/gamb1t", ORIGINAL_XDG_CURRENT_DESKTOP: "undefined", MallocNanoZone: "0", COLOR: "1", npm_config_noproxy: "", npm_config_local_prefix: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot", ZSH: "/Users/gamb1t/.oh-my-zsh", NVM_DIR: "/Users/gamb1t/.nvm", USER: "gamb1t", LS_COLORS: "di=1;36:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43", COMMAND_MODE: "unix2003", npm_config_globalconfig: "/Users/gamb1t/.nvm/versions/node/v21.6.1/etc/npmrc", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.xeaLOYnHMN/Listeners", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/bin/npm-cli.js", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", PATH: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/Code/projects/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/Code/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/node_modules/.bin:/Users/gamb1t/Desktop/node_modules/.bin:/Users/gamb1t/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Applications/Postgres.app/Contents/Versions/latest/bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Users/gamb1t/.cargo/bin", npm_package_json: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/package.json", npm_config_engine_strict: "true", _: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/node_modules/.bin/vite", npm_config_userconfig: "/Users/gamb1t/.npmrc", npm_config_init_module: "/Users/gamb1t/.npm-init.js", USER_ZDOTDIR: "/Users/gamb1t", __CFBundleIdentifier: "com.microsoft.VSCode", npm_command: "run-script", PWD: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot", VSCODE_NONCE: "220d25c0-079a-4fab-83fc-9f7d3a132464", npm_lifecycle_event: "build", EDITOR: "vi", P9K_SSH: "0", npm_package_name: "discord-bot", P9K_TTY: "old", LANG: "en_US.UTF-8", npm_config_npm_version: "10.4.0", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", XPC_FLAGS: "0x0", npm_config_node_gyp: "/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js", npm_package_version: "1.0.0", XPC_SERVICE_NAME: "0", VSCODE_INJECTION: "1", SHLVL: "2", HOME: "/Users/gamb1t", VSCODE_GIT_ASKPASS_MAIN: "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js", HOMEBREW_PREFIX: "/opt/homebrew", npm_config_cache: "/Users/gamb1t/.npm", LESS: "-R", LOGNAME: "gamb1t", npm_lifecycle_script: "NODE_ENV=development vite build", VSCODE_GIT_IPC_HANDLE: "/var/folders/9m/qv1zhl4j2r7_znd3vd8kx2yw0000gn/T/vscode-git-2ac0a7d6bc.sock", NVM_BIN: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin", npm_config_user_agent: "npm/10.4.0 node/v21.6.1 darwin arm64 workspaces/false", VSCODE_GIT_ASKPASS_NODE: "/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin)", GIT_ASKPASS: "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh", INFOPATH: "/opt/homebrew/share/info:/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", _P9K_SSH_TTY: "/dev/ttys003", npm_node_execpath: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin/node", npm_config_prefix: "/Users/gamb1t/.nvm/versions/node/v21.6.1", COLORTERM: "truecolor" };
let discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessageTyping
  ]
});
discordClient.once("ready", async () => {
  await discordClient.login(define_process_env_default$2.DISCORD_TOKEN);
});
const Servers = pgTable("servers", {
  id: serial("server_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(),
  guildName: varchar("guild_name", { length: 256 }),
  guildDescription: varchar("guild_description", { length: 256 }),
  guildOwnerId: varchar("guild_owner_id", { length: 256 }),
  verificationLevel: integer("verification_level"),
  guildNsfwLevel: integer("guild_nsfw_level"),
  approxMemberCount: integer("approx_member_count"),
  isActive: boolean("is_active").default(true),
  discordCreatedAt: timestamp("discord_created_at"),
  createdAt: timestamp("created_at").defaultNow()
});
const Channels = pgTable("channels", {
  id: serial("channel_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull(),
  guildId: varchar("guild_id", { length: 256 }).notNull(),
  channelName: varchar("channel_name", { length: 256 }).notNull(),
  channelType: integer("channel_type").notNull(),
  messageCount: integer("message_count"),
  totalMessageCount: integer("total_message_count"),
  userLimit: integer("user_limit"),
  userRateLimit: integer("user_rate_limit"),
  nsfw: boolean("nsfw"),
  permissions: varchar("permissions", { length: 256 }),
  flags: integer("flags"),
  isActive: boolean("is_active").default(true),
  discordCreatedAt: timestamp("discord_created_at"),
  createdAt: timestamp("created_at").defaultNow()
});
const UserConfiguration = pgTable("guild_configuration", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 256 }).unique().notNull(),
  indexableMessageChannels: text("indexable_message_channels").array().notNull().default(sql`ARRAY[]::text[]`),
  indexablePinnedChannels: text("indexable_pinned_channels").array().notNull().default(sql`ARRAY[]::text[]`)
});
const Messages = pgTable("messages", {
  id: serial("message_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).unique().notNull(),
  channelId: varchar("channel_id", { length: 256 }).notNull(),
  guildId: varchar("guild_id", { length: 256 }).notNull(),
  authorId: varchar("author_id", { length: 256 }).notNull(),
  content: text("content"),
  tokens: text("tokens").array(),
  lemmas: text("lemmas").array(),
  isPinned: boolean("is_pinned").notNull(),
  discordCreatedAt: timestamp("discord_created_at"),
  createdAt: timestamp("created_at").defaultNow()
});
const MessageEmbeds = pgTable("message_embeds", {
  id: serial("message_embed_id").primaryKey(),
  messageId: varchar("message_id", { length: 256 }).references(() => Messages.discordId).notNull(),
  title: text("title"),
  description: text("description"),
  url: text("url"),
  timestamp: timestamp("timestamp"),
  color: integer("color"),
  footerText: text("footer_text"),
  footerIconUrl: text("footer_icon_url"),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  authorName: text("author_name"),
  authorUrl: text("author_url"),
  authorIconUrl: text("author_icon_url"),
  discordCreatedAt: timestamp("discord_created_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
const MessageAttachments = pgTable("attachments", {
  id: serial("message_attachment_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).unique().notNull(),
  messageId: varchar("message_id", { length: 256 }).references(() => Messages.discordId).notNull(),
  url: text("url").notNull(),
  proxyUrl: text("proxy_url"),
  filename: varchar("filename", { length: 256 }),
  size: integer("size"),
  contentType: varchar("content_type", { length: 128 }),
  discordCreatedAt: timestamp("discord_created_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
const MessageEmbeddings = pgTable(
  "message_embeddings",
  {
    id: serial("embedding_id").primaryKey(),
    discordId: varchar("message_id", { length: 256 }).references(() => Messages.discordId).notNull(),
    embedding: vector("embedding", { dimensions: 512 }).notNull(),
    createdAt: timestamp("created_at").defaultNow()
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    )
  })
);
const AttachmentEmbeddings = pgTable("attachment_embeddings", {
  id: serial("attachment_embedding_id").primaryKey(),
  attachmentId: varchar("attachment_id", { length: 256 }).references(() => MessageAttachments.discordId).notNull(),
  embedding: vector("embedding", { dimensions: 512 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
const Questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  discordId: varchar("discord_id", { length: 256 }).unique().notNull(),
  originalText: text("original_text").notNull(),
  tokens: text("tokens").array().notNull(),
  lemmas: text("lemmas").array().notNull(),
  discordCreatedAt: timestamp("discord_created_at"),
  createdAt: timestamp("created_at").defaultNow()
});
const QuestionEmbeddings = pgTable("question_embeddings", {
  id: serial("id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).references(() => Questions.discordId).notNull(),
  embedding: vector("embedding", { dimensions: 512 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AttachmentEmbeddings,
  Channels,
  MessageAttachments,
  MessageEmbeddings,
  MessageEmbeds,
  Messages,
  QuestionEmbeddings,
  Questions,
  Servers,
  UserConfiguration
}, Symbol.toStringTag, { value: "Module" }));
var define_process_env_default$1 = { NODE_ENV: "development", NVM_INC: "/Users/gamb1t/.nvm/versions/node/v21.6.1/include/node", MANPATH: "/Users/gamb1t/.nvm/versions/node/v21.6.1/share/man:/opt/homebrew/share/man:/usr/share/man:/usr/local/share/man:/Users/gamb1t/.nvm/versions/node/v21.6.1/share/man:/opt/homebrew/share/man::", TERM_PROGRAM: "vscode", NODE: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin/node", INIT_CWD: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/dist", _P9K_TTY: "/dev/ttys003", NVM_CD_FLAGS: "-q", TERM: "xterm-256color", SHELL: "/bin/zsh", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/9m/qv1zhl4j2r7_znd3vd8kx2yw0000gn/T/", npm_config_global_prefix: "/Users/gamb1t/.nvm/versions/node/v21.6.1", TERM_PROGRAM_VERSION: "1.91.1", ZDOTDIR: "/Users/gamb1t", ORIGINAL_XDG_CURRENT_DESKTOP: "undefined", MallocNanoZone: "0", COLOR: "1", npm_config_noproxy: "", npm_config_local_prefix: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot", ZSH: "/Users/gamb1t/.oh-my-zsh", NVM_DIR: "/Users/gamb1t/.nvm", USER: "gamb1t", LS_COLORS: "di=1;36:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43", COMMAND_MODE: "unix2003", npm_config_globalconfig: "/Users/gamb1t/.nvm/versions/node/v21.6.1/etc/npmrc", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.xeaLOYnHMN/Listeners", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/bin/npm-cli.js", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", PATH: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/Code/projects/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/Code/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/node_modules/.bin:/Users/gamb1t/Desktop/node_modules/.bin:/Users/gamb1t/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Applications/Postgres.app/Contents/Versions/latest/bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Users/gamb1t/.cargo/bin", npm_package_json: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/package.json", npm_config_engine_strict: "true", _: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/node_modules/.bin/vite", npm_config_userconfig: "/Users/gamb1t/.npmrc", npm_config_init_module: "/Users/gamb1t/.npm-init.js", USER_ZDOTDIR: "/Users/gamb1t", __CFBundleIdentifier: "com.microsoft.VSCode", npm_command: "run-script", PWD: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot", VSCODE_NONCE: "220d25c0-079a-4fab-83fc-9f7d3a132464", npm_lifecycle_event: "build", EDITOR: "vi", P9K_SSH: "0", npm_package_name: "discord-bot", P9K_TTY: "old", LANG: "en_US.UTF-8", npm_config_npm_version: "10.4.0", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", XPC_FLAGS: "0x0", npm_config_node_gyp: "/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js", npm_package_version: "1.0.0", XPC_SERVICE_NAME: "0", VSCODE_INJECTION: "1", SHLVL: "2", HOME: "/Users/gamb1t", VSCODE_GIT_ASKPASS_MAIN: "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js", HOMEBREW_PREFIX: "/opt/homebrew", npm_config_cache: "/Users/gamb1t/.npm", LESS: "-R", LOGNAME: "gamb1t", npm_lifecycle_script: "NODE_ENV=development vite build", VSCODE_GIT_IPC_HANDLE: "/var/folders/9m/qv1zhl4j2r7_znd3vd8kx2yw0000gn/T/vscode-git-2ac0a7d6bc.sock", NVM_BIN: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin", npm_config_user_agent: "npm/10.4.0 node/v21.6.1 darwin arm64 workspaces/false", VSCODE_GIT_ASKPASS_NODE: "/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin)", GIT_ASKPASS: "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh", INFOPATH: "/opt/homebrew/share/info:/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", _P9K_SSH_TTY: "/dev/ttys003", npm_node_execpath: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin/node", npm_config_prefix: "/Users/gamb1t/.nvm/versions/node/v21.6.1", COLORTERM: "truecolor" };
DotenvFlow.config();
const connectionString = define_process_env_default$1.DB_URL || "";
const initializeDbClient = async () => {
  try {
    const db = await postgres(connectionString, { prepare: false });
    const dbClient2 = await drizzle(db, { schema });
    console.log("Database connected successfully.");
    return dbClient2;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};
const dbClient = initializeDbClient();
const loadGuilds = async () => {
  try {
    return discordClient.guilds.fetch();
  } catch (error) {
    console.error("Error fetching all Discord servers:", error);
    throw error;
  }
};
const loadGuild = async (id) => {
  try {
    const guildDetails = await discordClient.guilds.fetch(id);
    return guildDetails;
  } catch (error) {
    console.error(`Error fetching Discord server with ID ${id}:`, error);
    throw error;
  }
};
const loadCompleteGuilds = async () => {
  try {
    const guilds = await loadGuilds();
    const detailedGuildsPromises = await guilds.map(
      (guild) => loadGuild(guild.id)
    );
    const detailedGuilds = await Promise.all(detailedGuildsPromises);
    return detailedGuilds;
  } catch (error) {
    console.error("Error loading complete guilds:", error);
    return [];
  }
};
const formatGuild = (guild) => {
  return {
    discordId: guild.id,
    guildName: guild.name ?? null,
    guildDescription: guild.description ?? null,
    guildOwnerId: guild.ownerId ?? null,
    verificationLevel: guild.verificationLevel ?? null,
    guildNsfwLevel: guild.nsfwLevel ?? null,
    approxMemberCount: guild.memberCount ?? null,
    discordCreatedAt: guild.createdAt ?? null
  };
};
const formatGuilds = (guilds) => {
  const formattedGuilds = guilds.map((guild) => {
    return formatGuild(guild);
  });
  return formattedGuilds;
};
const findGuild = async (discordId) => {
  try {
    let db = await dbClient;
    const storedGuild = await db.query.Servers.findFirst({
      where: eq(Servers.discordId, discordId)
    });
    if (!storedGuild) {
      console.log(`No Stored guild with ${discordId} was found`);
      return null;
    }
    return await storedGuild;
  } catch (error) {
    console.error("Error finding guild:", error);
    throw { error: "Failed finding guild. Please try again later." };
  }
};
const compareGuilds = (newData, oldData) => {
  const newGuild = formatGuild(newData);
  const keys = Object.keys(newGuild);
  for (let key of keys) {
    if (newGuild[key]?.toString() !== oldData[key]?.toString()) {
      return false;
    }
  }
  return true;
};
const getChangedFields$1 = (newData, oldData) => {
  const newGuild = formatGuild(newData);
  const changedFields = Object.entries(newGuild).reduce(
    (changedFields2, [key, value]) => {
      if (value !== oldData[key]) {
        return { ...changedFields2, [key]: value };
      }
      return changedFields2;
    },
    {}
  );
  return changedFields;
};
const createChannel = async (channel) => {
  try {
    let newChannel;
    newChannel = await formatGuildChannel(channel);
    const db = await dbClient;
    await db.insert(Channels).values([newChannel]);
    console.log(
      `Inserted channel ${newChannel.discordId}:${newChannel.channelName}`
    );
  } catch (error) {
    console.error(
      `Error inserting channel ${channel.id}:${channel.name}`,
      error
    );
    throw error;
  }
};
const updateChannel = async (channel) => {
  try {
    let updatedChannel;
    updatedChannel = await formatGuildChannel(channel);
    let db = await dbClient;
    const id = updatedChannel.discordId;
    const found = await findChannel(id);
    if (!found) {
      return;
    }
    const changedFields = getChangedFields(updatedChannel, found);
    await db.update(Channels).set(changedFields).where(eq(Channels.discordId, found.discordId));
    console.log(
      `Updated channel: ${found.id}, changed fields: ${changedFields}`
    );
  } catch (error) {
    console.error(
      `Error updating channel ${channel.id}, ${channel.name}`,
      error
    );
  }
};
const loadGuildChannels = async (guild) => {
  const guildChannels = [];
  try {
    const channels = await guild.channels.fetch();
    channels.forEach((channel) => {
      guildChannels.push(channel);
    });
    await Promise.all(guildChannels);
    return guildChannels;
  } catch (error) {
    console.error(
      `Error fetching Discord channels for guild ${guild.id}:`,
      error
    );
    throw error;
  }
};
const formatGuildChannel = async (channel) => {
  try {
    const formattedChannel = {
      discordId: channel.id,
      guildId: channel.guild.id,
      channelName: channel.name,
      channelType: channel.type,
      messageCount: channel.messages?.cache.size ?? null,
      totalMessageCount: channel.totalMessageCount ?? null,
      userRateLimit: channel.rateLimitPerUser ?? null,
      userLimit: channel.userLimit ?? null,
      permissions: channel.permissions?.bitfield.toString() ?? null,
      nsfw: channel.nsfw ?? null,
      flags: channel.flags?.bitfield ?? null,
      discordCreatedAt: channel.createdAt ?? null
    };
    return formattedChannel;
  } catch (error) {
    console.error("Error creating formatting channel:", error);
    throw error;
  }
};
const findChannel = async (discordId) => {
  try {
    let db = await dbClient;
    const storedChannel = await db.query.Channels.findFirst({
      where: eq(Channels.discordId, discordId)
    });
    if (!storedChannel) {
      console.log(`No Stored channel with ${discordId} was found`);
      return null;
    }
    return await storedChannel;
  } catch (error) {
    console.error("Error finding channel:", error);
    throw { error: "Failed finding channel. Please try again later." };
  }
};
const compareChannels = async (newChannel, oldChannel) => {
  const channel = await formatGuildChannel(newChannel);
  const keys = Object.keys(channel);
  for (const key of keys) {
    if (channel[key] !== oldChannel[key]) {
      return false;
    }
  }
  return true;
};
const getChangedFields = (newData, oldData) => {
  const changedFields = Object.entries(newData).reduce(
    (changedFields2, [key, value]) => {
      if (value !== oldData[key]) {
        return { ...changedFields2, [key]: value };
      }
      return changedFields2;
    },
    {}
  );
  return changedFields;
};
//! make sure to be able to differentiate between an error and null and fix
const syncAllChannels = async () => {
  console.log(`Started syncing channels`);
  const allChannels = await loadCompleteGuilds();
  const newChannels = [];
  const modifiedChannels = [];
  const unchangedChannels = [];
  for (const guild of allChannels) {
    const channels = await loadGuildChannels(guild);
    for (const newChannel of channels) {
      const found = await findChannel(newChannel.id);
      if (found === null) {
        const newChannelPromise = createChannel(newChannel);
        newChannels.push(newChannelPromise);
      } else if (!compareChannels(newChannel, found)) {
        const modifiedChannel = updateChannel(newChannel);
        modifiedChannels.push(modifiedChannel);
      } else {
        unchangedChannels.push(newChannel);
      }
    }
  }
  await Promise.all([...newChannels, ...modifiedChannels]);
  console.log(
    `new channels: ${newChannels.length}, modified channels: ${modifiedChannels.length}, unchanged channels: ${unchangedChannels.length}`
  );
  return { newChannels, modifiedChannels, unchangedChannels };
};
const createGuild = async (guild) => {
  try {
    const formattedGuild = formatGuild(guild);
    const db = await dbClient;
    const res = await db.insert(Servers).values(formattedGuild).returning();
    if (!res || res.length === 0) {
      console.error("Insert operation did not return any results");
      return { error: "Failed to create guild. No result returned." };
    }
    return res[0];
  } catch (error) {
    console.error("Error creating guild:", error);
    return { error: "Failed to create guild. Please try again later." };
  }
};
const updateGuild = async (guild) => {
  try {
    const newGuild = await formatGuild(guild);
    const foundGuild = await findGuild(guild.id);
    if (!foundGuild) {
      return;
    }
    let db = await dbClient;
    const changedFields = getChangedFields$1(guild, foundGuild);
    await db.update(Servers).set(changedFields).where(eq(Servers.discordId, foundGuild.discordId));
    console.log(`Updated guild: ${foundGuild.id}, ${foundGuild.guildName}`);
  } catch (error) {
    console.error(`Error updating guild ${guild.id}:`, error);
  }
};
//! make sure to be able to differentiate between an error and null
const syncGuilds = async () => {
  console.log("Started syncing guilds");
  await loadGuilds();
  const completeGuilds = await loadCompleteGuilds();
  await formatGuilds(completeGuilds);
  const newGuilds = [];
  const modifiedGuilds = [];
  const unchangedGuilds = [];
  try {
    for (const guild of completeGuilds) {
      const found = await findGuild(guild.id);
      if (!found) {
        newGuilds.push(createGuild(guild));
      } else if (!compareGuilds(guild, found)) {
        modifiedGuilds.push(updateGuild(guild));
      } else {
        unchangedGuilds.push(guild);
      }
    }
    await Promise.all([...newGuilds, ...modifiedGuilds]);
    console.log(
      `new guilds: ${newGuilds.length}, modified guilds: ${modifiedGuilds.length}, unchanged guilds: ${unchangedGuilds.length}`
    );
  } catch (error) {
    console.error("Error syncing guilds:", error);
    throw error;
  }
};
var define_process_env_default = { NODE_ENV: "development", NVM_INC: "/Users/gamb1t/.nvm/versions/node/v21.6.1/include/node", MANPATH: "/Users/gamb1t/.nvm/versions/node/v21.6.1/share/man:/opt/homebrew/share/man:/usr/share/man:/usr/local/share/man:/Users/gamb1t/.nvm/versions/node/v21.6.1/share/man:/opt/homebrew/share/man::", TERM_PROGRAM: "vscode", NODE: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin/node", INIT_CWD: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/dist", _P9K_TTY: "/dev/ttys003", NVM_CD_FLAGS: "-q", TERM: "xterm-256color", SHELL: "/bin/zsh", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/9m/qv1zhl4j2r7_znd3vd8kx2yw0000gn/T/", npm_config_global_prefix: "/Users/gamb1t/.nvm/versions/node/v21.6.1", TERM_PROGRAM_VERSION: "1.91.1", ZDOTDIR: "/Users/gamb1t", ORIGINAL_XDG_CURRENT_DESKTOP: "undefined", MallocNanoZone: "0", COLOR: "1", npm_config_noproxy: "", npm_config_local_prefix: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot", ZSH: "/Users/gamb1t/.oh-my-zsh", NVM_DIR: "/Users/gamb1t/.nvm", USER: "gamb1t", LS_COLORS: "di=1;36:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43", COMMAND_MODE: "unix2003", npm_config_globalconfig: "/Users/gamb1t/.nvm/versions/node/v21.6.1/etc/npmrc", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.xeaLOYnHMN/Listeners", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/bin/npm-cli.js", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", PATH: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/Code/projects/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/Code/node_modules/.bin:/Users/gamb1t/Desktop/0xJariel/node_modules/.bin:/Users/gamb1t/Desktop/node_modules/.bin:/Users/gamb1t/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Applications/Postgres.app/Contents/Versions/latest/bin:/Users/gamb1t/.nvm/versions/node/v21.6.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Users/gamb1t/.cargo/bin", npm_package_json: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/package.json", npm_config_engine_strict: "true", _: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot/node_modules/.bin/vite", npm_config_userconfig: "/Users/gamb1t/.npmrc", npm_config_init_module: "/Users/gamb1t/.npm-init.js", USER_ZDOTDIR: "/Users/gamb1t", __CFBundleIdentifier: "com.microsoft.VSCode", npm_command: "run-script", PWD: "/Users/gamb1t/Desktop/0xJariel/Code/projects/gemini-bot", VSCODE_NONCE: "220d25c0-079a-4fab-83fc-9f7d3a132464", npm_lifecycle_event: "build", EDITOR: "vi", P9K_SSH: "0", npm_package_name: "discord-bot", P9K_TTY: "old", LANG: "en_US.UTF-8", npm_config_npm_version: "10.4.0", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", XPC_FLAGS: "0x0", npm_config_node_gyp: "/Users/gamb1t/.nvm/versions/node/v21.6.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js", npm_package_version: "1.0.0", XPC_SERVICE_NAME: "0", VSCODE_INJECTION: "1", SHLVL: "2", HOME: "/Users/gamb1t", VSCODE_GIT_ASKPASS_MAIN: "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js", HOMEBREW_PREFIX: "/opt/homebrew", npm_config_cache: "/Users/gamb1t/.npm", LESS: "-R", LOGNAME: "gamb1t", npm_lifecycle_script: "NODE_ENV=development vite build", VSCODE_GIT_IPC_HANDLE: "/var/folders/9m/qv1zhl4j2r7_znd3vd8kx2yw0000gn/T/vscode-git-2ac0a7d6bc.sock", NVM_BIN: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin", npm_config_user_agent: "npm/10.4.0 node/v21.6.1 darwin arm64 workspaces/false", VSCODE_GIT_ASKPASS_NODE: "/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin)", GIT_ASKPASS: "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh", INFOPATH: "/opt/homebrew/share/info:/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", _P9K_SSH_TTY: "/dev/ttys003", npm_node_execpath: "/Users/gamb1t/.nvm/versions/node/v21.6.1/bin/node", npm_config_prefix: "/Users/gamb1t/.nvm/versions/node/v21.6.1", COLORTERM: "truecolor" };
DotenvFlow.config({
  path: "./dist",
  // Adjust the path based on your project structure
  node_env: "development"
});
const startBot = async () => {
  try {
    await loadEventListeners(discordClient);
    await loadSlashCommands(discordClient);
    await discordClient.login(define_process_env_default.DISCORD_TOKEN);
    discordClient.once("ready", async () => {
      if (discordClient.user) {
        console.log(`Logged in as ${discordClient.user.tag}`);
      } else {
        console.log("Discord client user is not available.");
      }
      await syncGuilds();
      await syncAllChannels();
      console.log("you are the CaPiTaN now!");
    });
  } catch (error) {
    console.error("Error starting the bot:", error);
  }
};
await startBot();
