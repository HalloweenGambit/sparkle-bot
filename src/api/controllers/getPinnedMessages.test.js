class Stack {
  constructor() {
    this.top = -1;
    this.items = {};
  }
}

describe("My stack", () => {
  it("gets all channel ids", () => {
    const stack = new Stack();

    expect(stack.top).toBe(-1);
    expect(stack.items).toEqual({});
  });
  it.todo("gets all channel pinned comments");
  it.todo("gets a specific channelIds pinned comments");
});
