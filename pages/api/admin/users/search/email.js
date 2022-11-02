import { getSession } from "next-auth/client";
import { get, omit } from "lodash";
import userFunctions from "@utils/db/users";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const session = await getSession({ req });
    const requestQuery = get(req, "query.email", null);

    if (!get(session, "user.admin", false)) {
      res.status(200).send({
        error: "Not authorized",
      });
      return resolve();
    }

    if (!requestQuery) {
      res.status(200).send({
        error: "No query",
      });
    }

    const { searchByEmail } = await userFunctions();
    const { users } = await searchByEmail(requestQuery);

    res.status(200).send({
      users,
    });
    return resolve();
  });
};
