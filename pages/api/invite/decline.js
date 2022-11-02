import { getSession } from "next-auth/client";
import { get, omit } from "lodash";
import channelFunctions from "@utils/db/channels";
import cache from "@utils/cache";
import signer from "nacl-signature";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const session = await getSession({ req });
    const requestData = get(req, "body", null);

    const secretKey = process.env.MSG_KEY_SECRET;

    const { channelUid } = requestData;

    const { user } = session;

    if (!channelUid || !session) {
      res.end();
      return resolve();
    }

    const { get: getChannel, setPosition } = await channelFunctions();
    getChannel({ uid: channelUid }).then(async ({ channel }) => {
      let response = channel;

      const { uid } = channel;

      const currentUserId = get(user, "_id");

      if (get(channel, "main.user") == currentUserId) {
        response = await setPosition(channelUid, "main", {
          user: null,
          name: null,
          agoraId: null,
        });
      }

      if (get(channel, "guest_1.user") == currentUserId) {
        response = await setPosition(channelUid, "guest_1", {
          user: null,
          name: null,
          agoraId: null,
        });
      }

      if (get(channel, "guest_2.user") == currentUserId) {
        response = await setPosition(channelUid, "guest_2", {
          user: null,
          name: null,
          agoraId: null,
        });
      }

      if (get(channel, "guest_3.user") == currentUserId) {
        response = await setPosition(channelUid, "guest_3", {
          user: null,
          name: null,
          agoraId: null,
        });
      }

      const cacheKey = `query-channel_data-${uid}`;

      const signature = signer.sign(JSON.stringify(response), secretKey);

      cache.setObject(
        cacheKey,
        {
          channel,
        },
        3600 * 24
      );

      res.status(200).send({
        success: true,
        channel: omit(response, ["json"]),
        signature,
      });
      return resolve();
    });

    return resolve();
  });
};
