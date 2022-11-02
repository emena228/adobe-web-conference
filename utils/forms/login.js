export default async ({
  setSubmitting,
  setErrors,
  signIn,
  callbackUrl,
  userId,
  password,
  errors,
}) => {
  let newErrors = { ...errors };

  setSubmitting(true);

  newErrors.userId = userId == "" ? true : false;
  newErrors.password = password == "" ? true : false;

  setErrors({ ...newErrors });

  if (newErrors.userId || newErrors.password) {
    setSubmitting(false);
    return;
  }

  // const captchaToken = await executeRecaptcha("login");

  signIn("credentials", {
    email: userId,
    password,
    // captchaToken,
    callbackUrl: callbackUrl,
    // redirect: true,
  }).catch((error) => {
    console.error(error);
    // setWorking(false);
    setSubmitting(false);
    // message.error("Something went wrong...");
  });
};
