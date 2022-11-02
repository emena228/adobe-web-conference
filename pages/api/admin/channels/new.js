import { getSession } from "next-auth/client";
import { get } from "lodash";
import channelFunctions from "@utils/db/channels";
import cache from "@utils/cache";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const requestData = get(req, "body", null);
    const { user } = await getSession({ req });

    if (!user) {
      res.end();
      return resolve();
    }

    if (!requestData) {
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
      return resolve();
    }

    try {
      const newChannel = requestData;

      const { insert: insertChannel } = await channelFunctions();

      insertChannel(newChannel.values, user)
        .then((channel) => {
          res.status(200).send({ success: true, text: "Channel added!", ...channel });
          return resolve();
        })
        .catch(({ error }) => {
          res.status(200).send({ success: false, text: error });
          return resolve();
        });
    } catch (err) {}
  });
};
