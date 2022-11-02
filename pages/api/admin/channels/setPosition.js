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
      let clearPosition = false;
      const secretKey = process.env.MSG_KEY_SECRET;

      const { channelId, role, subject } = requestData;
      // console.log(requestData);

      if (!channelId || !role || !subject || !session) {
        res.end();
        return resolve();
      }

      const { get: getChannel, setPosition } = await channelFunctions();

      const { channel } = await getChannel({ uid: channelId });
      // console.log("channel", channel);
      if (get(channel, "presenter_1._id", null) === subject._id) {
        clearPosition = "presenter_1";
      }
      if (get(channel, "presenter_2._id", null) === subject._id) {
        clearPosition = "presenter_2";
      }
      if (get(channel, "presenter_3._id", null) === subject._id) {
        clearPosition = "presenter_3";
      }
      if (get(channel, "presenter_4._id", null) === subject._id) {
        clearPosition = "presenter_4";
      }
      if (get(channel, "presenter_5._id", null) === subject._id) {
        clearPosition = "presenter_5";
      }

      const { channel: updatedChannel } = await setPosition(
        channelId,
        role,
        subject,
        clearPosition
      );

      // const { uid } = channel;

      console.log(channelId, role, subject, clearPosition);

      // const cacheKey = `query-channel_data-${uid}`;

      // cache.setObject(
      //   cacheKey,
      //   {
      //     channel,
      //   },
      //   3600 * 24
      // );

      const signature = signer.sign(JSON.stringify(updatedChannel), secretKey);

      // res.status(200).send({ success: true, channel, signature });
      res
        .status(200)
        .send({ success: true, signature, channel: updatedChannel });
      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
      return resolve();
    }
  });
};
