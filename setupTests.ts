import dbClient from "./src/config/dbConfig";
import discordClient from "./src/config/discordConfig";
import { beforeAll } from "vitest";

// Todo: disconnect from dbClient after every test.

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
