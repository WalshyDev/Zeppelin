import { Snowflake, TextChannel } from "discord.js";
import * as t from "io-ts";
import { tNullable, verboseChannelMention } from "../../../utils";
import { automodTrigger } from "../helpers";

// tslint:disable-next-line:no-empty-interface
interface AnyMessageResultType {}

export const AnyMessageTrigger = automodTrigger<AnyMessageResultType>()({
  configType: t.type({
    channel_id: tNullable(t.string),
  }),

  defaultConfig: {
    channel_id: null,
  },

  async match({ pluginData, context, triggerConfig: trigger }) {
    if (!context.message) {
      return;
    }

    if (trigger.channel_id) {
      if (context.message.channel_id === trigger.channel_id) {
        return { extra: { channel_id: trigger.channel_id } };
      }

      return;
    }

    return {
      extra: {},
    };
  },

  renderMatchInformation({ pluginData, contexts, matchResult }) {
    const channel = pluginData.guild.channels.cache.get(contexts[0].message!.channel_id as Snowflake) as TextChannel;
    return `Matched message (\`${contexts[0].message!.id}\`) in ${
      channel ? verboseChannelMention(channel) : "Unknown Channel"
    }`;
  },
});
