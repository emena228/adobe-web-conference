import { getSession } from "next-auth/client";
import { get } from "lodash";
import userFunctions from "@utils/db/users";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const requestData = get(req, "body", null);
    const session = await getSession({ req });

    if (!get(session, "user.admin", false)) {
      res.status(200).send({
        error: "Not authorized",
      });
      return resolve();
    }

    if (!requestData) {
      res.end();
      return resolve();
    }

    try {
      const newUser = requestData;

      const { insert: insertUser } = await userFunctions();

      insertUser(newUser.values)
        .then((user) => {
          res.status(200).send({ success: true, text: "User added!", ...user });
          return resolve();
        })
        .catch(({ error }) => {
          res.status(200).send({ success: false, text: error });
          return resolve();
        });
    } catch (err) {}
  });
};
