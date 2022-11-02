import { getSession } from "next-auth/client";
import { get } from "lodash";
import userFunctions from "@utils/db/users";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const {
      query: { id },
    } = req;
    const session = await getSession({ req });

    if (!get(session, "user.admin", false)) {
      res.status(200).send({
        error: "Not authorized",
      });
      return resolve();
    }

    const { get: getUser } = await userFunctions();
    getUser({ _id: id }).then(({ user }) => {
      res.status(200).send(user);
      return resolve();
    });
  });
};
