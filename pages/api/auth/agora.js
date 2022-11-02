import { getSession } from "next-auth/client";
import { get } from "lodash";
import channelFunctions from "@utils/db/channels";
import userFunctions from "@utils/db/users";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

export default async (req, res) =>
  new Promise(async (resolve) => {
    const session = await getSession({ req });
    const requestData = get(req, "query", null);

    const { channel, userId } = requestData;
    const { user } = session;

    if (!user) {
      return res.json({ unauthorized: true });
    }

    if (!channel) {
      return res.json({ error: true, message: "Invalid channel" });
    }

    const { get: getChannel } = await channelFunctions();
    const { get: getUser, assignAgoraId } = await userFunctions();

    const { channel: channelData } = await getChannel({ uid: channel });
    let uid = null;

    if (!user.agoraId) {
      const { user: updatedUser } = await assignAgoraId(user._id);
      uid = updatedUser.agoraId;
    } else {
      uid = user.agoraId;
    }

    if (userId) {
      uid = userId;
    }

    const {
      user: { defaultOnStage },
    } = await getUser({ _id: user._id });

    const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    const isOnStage = defaultOnStage || false;
    const role = isOnStage ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const expirationTimeInSeconds = 3600 * 2; // 2 Hours
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channel,
      uid,
      role,
      privilegeExpiredTs
    );

    const isPresenter =
      get(channelData, "presenter_1._id") === user._id
        ? true
        : get(channelData, "presenter_2._id") === user._id
        ? true
        : get(channelData, "presenter_3._id") === user._id
        ? true
        : get(channelData, "presenter_4._id") === user._id
        ? true
        : get(channelData, "presenter_5._id") === user._id
        ? true
        : false;

    const isMainPresenter =
      get(channelData, "presenter_1._id") === user._id ? true : false;

    res.json({
      token,
      channelData,
      uid,
      isMainPresenter,
      isPresenter: isPresenter,
      onStage: isOnStage,
    });
    return resolve();
  });
