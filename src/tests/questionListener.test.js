import { describe, vi, test, expect } from "vitest";
import discordClient from "../../../config/discordConfig.js";
import dbClient from "../../../config/dbConfig.js";
import gptClient from "../../loaders/geminiProLoader.js";
import questionListener from "./questionListener.js";
import { handleMessageCreate } from "./handlers/handlers.js";

vi.mock("../../../config/discordConfig.js", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    on: vi.fn(),
  };
});

vi.mock("../../../config/dbClient.js");
vi.mock("../../loaders/geminiProLoader.js");
vi.mock("./handlers/handlers.js");

describe("questionListener", () => {
  test("should call handleMessageCreate on messageCreate", () => {
    const mockedMessage = {
      content: "Is this project open source?",
      author: "",
    };

    questionListener(discordClient, dbClient, gptClient);

    // Check if the 'on' method was called correctly
    expect(discordClient.on).toBe("messageCreate", expect.any(Function));

    // Simulate the event
    const callback = discordClient.on.mock.calls[0][1];
    callback(mockedMessage);

    // Check if handleMessageCreate was called with the right arguments
    expect(handleMessageCreate).toHaveBeenCalledWith(
      mockedMessage,
      dbClient,
      gptClient
    );
  });
});
