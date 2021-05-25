import { IConfigOptions } from "../../src/types";
import { Config } from "../../src/common/config";
import { DEFAULT_TEST_TIMEOUT } from "../../src/consts";

describe("testing config", () => {
  it("should set all values to configs", () => {
    const configOptions: Partial<IConfigOptions> = {
      botPrefix: "!",
      botTestId: "123",
      guildId: "123",
      testMatches: ["123"],
      timeout: DEFAULT_TEST_TIMEOUT,
    };

    const config = new Config();
    config.setConfigs(configOptions);
    expect(config).toEqual({ ...configOptions, timeout: DEFAULT_TEST_TIMEOUT });
  });

  it("should force update settings", () => {
    const updatadedConfig: IConfigOptions = {
      silent: true,
      botPrefix: "+",
      botTestId: "321",
      channelId: "111",
      cordeBotToken: "333",
      guildId: "11111",
      testMatches: ["321", "32121"],
      timeout: 1222,
      botToken: "lacjxlakjs12312",
    };

    const config = new Config();
    config.setConfigs({
      botPrefix: "!",
      botTestId: "123",
      channelId: "",
      cordeBotToken: "",
      guildId: "123",
      testMatches: ["123"],
      timeout: undefined,
      botToken: undefined,
    });
    config.setConfigs(updatadedConfig, true);
    expect(config).toEqual(updatadedConfig);
  });
});
