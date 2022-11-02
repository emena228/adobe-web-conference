import userFunctions from "@utils/db/users";
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

      const { subject, onStage } = requestData;
      // console.log(requestData);

      if (!subject || !session) {
        res.end();
        return resolve();
      }

      const { setRole } = await userFunctions();

      const { user } = await setRole(onStage, subject._id);

      const { _id: userId, defaultOnStage } = user;

      // const cacheKey = `query-channel_data-${uid}`;

      // cache.setObject(
      //   cacheKey,
      //   {
      //     channel,
      //   },
      //   3600 * 24
      // );

      // const signature = signer.sign(JSON.stringify(updatedChannel), secretKey);

      // res.status(200).send({ success: true, channel, signature });
      res
        .status(200)
        .send({ success: true, subject: userId, onStage: defaultOnStage });
      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
      return resolve();
    }
  });
};
