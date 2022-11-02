export default async ({ getCsrfToken, setSubmitting, setErrors, csrfToken, executeRecaptcha, signIn, firstName = "", lastName = "", email, password, errors }) => {
  let newErrors = { ...errors };

  setSubmitting(true);

  newErrors.firstName = firstName == "" ? true : false;
  newErrors.lastName = lastName == "" ? true : false;
  newErrors.email = email == "" ? true : false;
  newErrors.password = password == "" ? true : false;

  setErrors({ ...newErrors });

  if (newErrors.firstName || newErrors.lastName || newErrors.email || newErrors.password) {
    setSubmitting(false);
    return;
  }

  if (!executeRecaptcha) {
    return;
  }

  const captchaToken = await executeRecaptcha("signup");
  fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email: email,
      password: password,
      _csrf: csrfToken || (await getCsrfToken()),
      _captcha: captchaToken,
      mailingListConsent: false,
      json: true,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then(async (response) => {
      const { success, text } = response;
      if (success) {
        const captchaToken = await executeRecaptcha("login");
        signIn("credentials", {
          email: email,
          password,
          captchaToken,
          callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
        }).catch((error) => {
          console.error(error);
          setSubmitting(false);
        });
      }
    });
};
