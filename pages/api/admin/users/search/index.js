import { getSession } from "next-auth/client";
import { get } from "lodash";
import userFunctions from "@utils/db/users";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const session = await getSession({ req });
    const requestQuery = get(req, "query.name", null);

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

    const { search: searchUsers } = await userFunctions();
    const { users } = await searchUsers(requestQuery);

    res.status(200).send({
      users: users.map(({ name, _id }) => {
        return { name, _id };
      }),
    });
    return resolve();
  });
};
