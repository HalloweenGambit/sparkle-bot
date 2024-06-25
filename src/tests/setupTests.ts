import dbClient from "../config/dbConfig";
import discordClient from "../config/discordConfig";
import { beforeAll } from "vitest";

// Code you want to run before every describe block
beforeAll(async () => {
  // Your setup code here
  await dbClient;
  await discordClient.login(process.env.DISCORD_TOKEN);
  discordClient.once("ready", () => {
    console.log("test discordClient logged in");
  });
  console.log("Running setup before all tests");
});
