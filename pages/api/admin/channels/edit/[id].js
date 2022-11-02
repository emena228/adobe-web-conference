import { getSession } from "next-auth/client";
import { get, omit } from "lodash";
import channelFunctions from "@utils/db/channels";
import cache from "@utils/cache";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const {
      query: { id },
    } = req;
    const requestData = get(req, "body", null);
    const session = await getSession({ req });

    if (!get(session, "user.admin", false)) {
      res.status(200).send({ success: false, error: "Admin required" });
      return resolve();
    }

    const { update: updateChannel } = await channelFunctions();

    const channelData = requestData.values;
    updateChannel(id, omit(channelData, ["_id", "json"]))
      .then(({ success, text, channel }) => {
        const { uid } = channel;

        const cacheKey = `query-channel_data-${uid}`;

        cache.setObject(
          cacheKey,
          {
            channel,
          },
          3600 * 24
        );

        res.status(200).send({
          success,
          text,
          ...omit(channel, ["json"]),
        });
        return resolve();
      })
      .catch((response) => {
        return res.status(200).send(response);
      });
  });
};
