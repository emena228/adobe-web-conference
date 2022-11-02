import channelFunctions from "@utils/db/channels";
import { get } from "lodash";
import cache from "@utils/cache";
import { getSession } from "next-auth/client";
import signer from "nacl-signature";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getSession({ req });
      const requestData = get(req, "body", null);

      const secretKey = process.env.MSG_KEY_SECRET;

      const { channelId, view } = requestData;

      if (!channelId || !view || !session) {
        res.end();
        return resolve();
      }

      if (!get(session, "user.admin", false)) {
        res.status(200).send({
          error: "Not authorized",
        });
        return resolve();
      }

      const { setView } = await channelFunctions();
      const channel = await setView(channelId, view);

      const { uid } = channel;

      const cacheKey = `query-channel_data-${uid}`;

      cache.setObject(
        cacheKey,
        {
          channel,
        },
        3600 * 1
      );

      const signature = signer.sign(JSON.stringify(channel), secretKey);

      res.status(200).send({ success: true, channel, signature });
      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
      return resolve();
    }
  });
};
