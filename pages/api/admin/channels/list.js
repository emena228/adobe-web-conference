import { get, omit } from "lodash";
import channelFunctions from "@utils/db/channels";
import { getSession } from "next-auth/client";

export default async (req, res) => {
  //   try {
  return new Promise(async (resolve, reject) => {
    const session = await getSession({ req });

    const { list: listChannels } = await channelFunctions();

    const { channels } = await listChannels({
      //   status: "published",
    });

    res.json({
      channels: channels.map((channel) => {
        return omit(
          {
            ...channel,
          },
          [""]
        );
      }),
    });
    return resolve();
    //   } catch (e) {
    //     console.log(e);
    //     return res.status(500).json(e);
    //   }
  });
};
