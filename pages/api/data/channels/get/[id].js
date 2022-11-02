import { getSession } from "next-auth/client";
import { omit } from "lodash";
import cache from "@utils/cache";
import channelFunctions from "@utils/db/channels";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const {
      query: { id },
    } = req;
    const session = await getSession({ req });

    if (!session) {
      res.end();
      return resolve();
    }

    const cacheKey = `query-channel_data-${id}`;
    const cachedValue = await cache.getObject(cacheKey);

    if (cachedValue) {
      const { channel: channelData } = cachedValue;
      res.status(200).send({
        channelData: omit(channelData, ["json"]),
      });
      return resolve();
    }

    const { get: getChannel } = await channelFunctions();
    getChannel({ uid: id }).then(({ channel }) => {
      cache.setObject(
        cacheKey,
        {
          channel,
        },
        3600 * 2
      );

      res.status(200).send({
        channelData: omit(channel, ["json"]),
      });
      return resolve();
    });
  });
};
