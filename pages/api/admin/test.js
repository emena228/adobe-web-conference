import { get, omit } from "lodash";
import userFunctions from "@utils/db/users";
import { getSession } from "next-auth/client";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { capitalize } from "@utils/functions";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getSession({ req });
      const requestData = get(req, "query", null);

      const { amount = 20 } = requestData;

      const users = [];

      const { insert: insertUser } = await userFunctions();

      //   deleteRobots
      //   const results = await deleteRobots();

      //   console.log(results);

      for (let x = 0; x < amount; x++) {
        const shortName = uniqueNamesGenerator({
          dictionaries: [adjectives, animals, colors],
          separator: " ",
          length: 2,
        });
        const name = shortName.split(" ");

        await insertUser({
          firstName: capitalize(name[0]),
          lastName: `${capitalize(name[1])}.`,
          email: `${name[0]}.${name[1]}@test.com`,
          password: "testMe123!",
          robot: true,
        }).then((user) => {
          users.push(user);
        });
      }

      res.status(200).send(
        JSON.stringify({
          users,
        })
      );

      //   res.status(200).send(JSON.stringify({ results }));

      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
      return resolve();
    }
  });
};
