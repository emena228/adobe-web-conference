import { getSession } from "next-auth/client";
import { omit } from "lodash";
import channelFunctions from "@utils/db/channels";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const {
      query: { id },
    } = req;
    const session = await getSession({ req });

    if (!session.user) {
      res.end();
      return resolve();
    }

    const { get: getChannel } = await channelFunctions();
    getChannel({ _id: id }).then(({ channel }) => {
      res.status(200).send({
        ...omit(channel, ["json"]),
      });
      return resolve();
    });
  });
};
