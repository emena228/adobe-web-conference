import channelFunctions from "@utils/db/channels";
import { get } from "lodash";
import cache from "@utils/cache";
import { getSession } from "next-auth/client";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getSession({ req });
      const requestData = get(req, "body", null);

      const { channelId, layout } = requestData;

      if (!channelId || !layout || !session) {
        res.end();
        return resolve();
      }

      const { setLayout } = await channelFunctions();
      const channel = await setLayout(channelId, layout);

      const { uid } = channel;

      const cacheKey = `query-channel_data-${uid}`;

      cache.setObject(
        cacheKey,
        {
          channel,
        },
        3600 * 24
      );

      res.status(200).send({ success: true, channel });
      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
      return resolve();
    }
  });
};
