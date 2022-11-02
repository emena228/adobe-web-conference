import { getSession } from "next-auth/client";
import { get, omit } from "lodash";
import userFunctions from "@utils/db/users";

export default async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const {
      query: { id },
    } = req;
    const requestData = get(req, "body", null);
    const session = await getSession({ req });

    if (!get(session, "user.admin", false)) {
      res.status(200).send({
        error: "Not authorized",
      });
      return resolve();
    }

    const { update: updateUser } = await userFunctions();
    updateUser(id, omit(requestData, ["json"]))
      .then(({ success, text, user }) => {
        res.status(200).send({
          success,
          text,
          user,
        });
        return resolve();
      })
      .catch((response) => {
        res.status(200).send(response);
        return resolve();
      });
  });
};
