import { describe, it, expect } from "corde";

describe("testing create command", () => {
  it("should return that user has already a account", () => {
    expect("create").toReturn("You already have a hero created called `hero`");
  });
});
