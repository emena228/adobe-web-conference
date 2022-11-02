import { getSession, getCsrfToken } from "next-auth/client";
import { get } from "lodash";
import UserFunctions from "@utils/db/users";

export default async (req, res) => {
  const session = await getSession({ req });
  const csrfToken = await getCsrfToken({ req });

  const requestData = get(req, "body", null);

  if (session) {
    return res.status(200).send({
      success: false,
      error: true,
      text: "Already signed in.",
    });
  }

  if (!requestData) {
    return res.status(200).send({
      success: false,
      error: true,
      text: "Missing data",
    });
  }

  const {
    firstName = "",
    lastName = "",
    email = "",
    password,
    _csrf,
    _captcha,
    mailingListConsent = null,
  } = requestData;

  const requestEmail = email;
  const mailingListConsentValue = mailingListConsent != null ? true : false;

  if (
    requestEmail === "" ||
    firstName === "" ||
    lastName === "" ||
    password === "" ||
    !_captcha
  ) {
    return res.status(200).send({
      success: false,
      error: true,
      text: "Invalid params",
    });
  }

  if (csrfToken !== _csrf) {
    return res.status(200).send({
      success: false,
      error: true,
      text: "Invalid CSRF",
    });
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${_captcha}`;

  const captchaResult = await fetch(verificationUrl, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  if (!captchaResult || !captchaResult.success || captchaResult.score < 0.6) {
    return res.status(200).send({
      valid: false,
      text: "Invalid Google Captcha. Please try refreshing your browser.",
    });
  }

  const { insert: insertUser } = await UserFunctions();

  const user = await insertUser({
    firstName,
    lastName,
    email: requestEmail,
    password,
    mailingList: mailingListConsentValue,
  }).catch(({ error }) => {
    if (error === "duplicate_user_email") {
      return res.status(200).send({
        success: false,
        text: "A duplicate user account was found.",
      });
    }
    return res.status(200).send({
      success: false,
      text: "We had issues setting up your account. This event has been logged.",
    });
  });

  if (user) {
    return res.status(200).send({
      success: true,
      user,
    });
  } else {
    return res.status(200).send({
      success: false,
      text: "We had issues setting up your account. This event has been logged.",
    });
  }
};
