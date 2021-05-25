/* eslint-disable @typescript-eslint/no-var-requires */

const { test, expect, beforeStart } = require("corde");
const { login } = require("../src/bot");

beforeStart(async () => {
  await login();
});

test("ping should return pong", () => {
  expect("ping").toReturn("pong");
});
