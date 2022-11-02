import Prismic from "@prismicio/client";
import { getSession } from "next-auth/client";
import { get } from "lodash";
import { Client } from "~/prismic-configuration.js";
import cache from "@utils/cache";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const session = await getSession({ req });

    if (!get(session, "user", false)) {
      res.status(200).send({
        error: "Not authorized",
      });
      return resolve();
    }

    const client = Client();
    const cacheKey = `schedule-modal_data`;
    const cachedValue = await cache.getObject(cacheKey);

    if (cachedValue) {
      const { data: cachedData } = cachedValue;
      res.status(200).send({ data: cachedData, debug: { cacheKey } });
      return resolve();
    }

    const { data } = await client.getByUID("agenda", "agenda");

    if (!data) {
      res.status(404).send({ error: "data not found." });
      return resolve();
    }

    cache.setObject(
      cacheKey,
      {
        data,
      },
      3600 * 1
    );

    res.status(200).send({ success: true, data });
  });
};
