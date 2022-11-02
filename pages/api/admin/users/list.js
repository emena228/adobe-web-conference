import { getSession } from "next-auth/client";
import { get, omit } from "lodash";
import userFunctions from "@utils/db/users";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const session = await getSession({ req });

    if (!get(session, "user.admin", false)) {
      res.status(200).send({
        error: "Not authorized",
      });
      return resolve();
    }

    const { list: listUsers } = await userFunctions();
    const { users } = await listUsers({});

    const allUsers = users.map((user) => {
      return omit(user, ["json", "password"]);
    });

    res.status(200).send({
      users: allUsers,
    });
    return resolve();
  });
};
