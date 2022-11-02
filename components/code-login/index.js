import React, { useEffect, useState, useRef } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import { Alert, AlertTitle } from "@material-ui/lab";
import heroSrc from "@images/hero.png";
import rpdrHeroSrc from "@images/rpdr-hero.png";
import Grid from "@material-ui/core/Grid";
import { useRouter } from "next/router";
import ReactCodeInput from "react-code-input";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { get } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { signIn } from "next-auth/client";
import formSubmitFunc from "@utils/forms/login";

import styles from "./index.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  buttonWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: "black",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -12,
  },
  image: {
    backgroundColor: "#737E7C",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    position: "relative",
    margin: "160px auto",
    display: "flex",
    width: "100%",
    alignItems: "center",
    padding: "110px 30px 60px 30px",
    border: '2px solid white',
    color: 'white'
  },
  paperInner: {
    alignItems: "center",
    position: "relative",
    zIndex: "100",
    width: "100%",
  },
  // paperLogo: {
  //   maxWidth: "480px",
  //   margin: "0 0 50px 0",
  // },
  paperLogoImg: {
    maxWidth: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: "7px 25px",
    fontWeight: 700,
  },
}));

export default function Login({ query = {} }) {
  const { email, confirmation = "" } = query;
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [code, setCode] = useState(confirmation);
  const form = useRef();
  const userIdField = useRef();
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    query: { email: errorEmail = "", error },
  } = router;

  const callbackUrl = get(
    router.query,
    "callback",
    process.env.NEXT_PUBLIC_SITE_URL
  );

  useEffect(() => {
    userIdField.current.focus();
  }, []);

  useEffect(() => {
    if (email) {
      userIdField.current.value = email;
      setSubmitDisabled(false);

      if (code && executeRecaptcha) {
        setTimeout(() => {
          onFormSubmit();
        }, 700);
      }
    }
  }, [query, executeRecaptcha]);

  const onFormSubmit = (e = null) => {
    const userId = get(userIdField, "current.value", email);

    if (e) {
      e.preventDefault();
    }

    setSubmitting(true);
    formSubmitFunc({
      executeRecaptcha,
      setSubmitting,
      setErrors,
      signIn,
      callbackUrl,
      errors,
      userId,
      password: code,
    });
  };

  const styleProps = {
    inputStyle: {
      backgroundColor: "transparent",
      lineHeight: "1em",
      fontWeight: 700,
      margin: "4px",
      width: "52px",
      padding: "11px 7px 7px 7px",
      textAlign: "center",
      MozAppearance: "textfield",
      borderRadius: "3px",
      fontSize: "32px",
      paddingLeft: "7px",
      color: "white",
      border: "2px solid white",
      textTransform: "uppercase",
      outlineColor: "#f26722",
    },
    inputStyleInvalid: {
      margin: "4px",
      MozAppearance: "textfield",
      borderRadius: "3px",
      fontSize: "14px",
      height: "26px",
      paddingLeft: "7px",
      color: "red",
      border: "2px solid white",
    },
  };

  return (
    <div className={styles.wrapper}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <div className={`${classes.paper}`}>
          <div className={classes.paperInner}>
            
            {error === "preview-only" && (
              <Alert
                severity="error"
                style={{ width: "100%", margin: "30px 0" }}
              >
                <AlertTitle>Preview Credentials Required</AlertTitle>
                <strong>
                  We found your profile but <strong>PREVIEW ACCESS</strong> is
                  required to login at this time &mdash; speak to your Avalara
                  contact if believe you are seeing this in error.
                </strong>
              </Alert>
            )}
            {error === "invalid-credentials" && (
              <Alert
                severity="error"
                style={{ width: "100%", margin: "30px 0" }}
              >
                <AlertTitle style={{ margin: 0 }}>
                  Incorrect email address or confirmation number.
                </AlertTitle>
              </Alert>
            )}
            {error === "account-locked" && (
              <Alert
                severity="error"
                style={{ width: "100%", margin: "30px 0" }}
              >
                <AlertTitle style={{ margin: 0 }}>Account Locked</AlertTitle>
                <strong>
                  Your account has been locked as a result of too many failed
                  login attempts. Please{" "}
                  <a
                    style={{ borderBottom: "1px solid rgb(97, 26, 21)" }}
                    href="mailto:avalaraCRUSH@avalara.com?subject=Account%20Locked"
                  >
                    contact us
                  </a>
                  .
                </strong>
              </Alert>
            )}
            <form
              className={`${classes.form} ${styles.form}`}
              ref={form}
              noValidate
              onSubmit={onFormSubmit}
            >
              <InputLabel
                htmlFor="email"
                style={{
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "bold",

                }}
              >
                Email Address:
              </InputLabel>
              <TextField
                variant="outlined"
                margin="normal"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: "0px",
                  color: "#6d57a5",
                  border: '2px solid white',

                }}
                className={`loginUserEmail`}
                required
                fullWidth
                id="email"
                label={null}
                name="email"
                defaultValue={errorEmail}
                error={errors.userId}
                autoComplete="email"
                inputRef={userIdField}
                InputLabelProps={{
                  shrink: true,
                }}
                autoFocus
              />

              <div className={styles.confirmationField}>
                <InputLabel
                  htmlFor="confirmation-code"
                  style={{
                    color: "white",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  Login Code:
                </InputLabel>

                <div style={{ position: "relative", left: "-4px" }}>
                  <ReactCodeInput
                    type="text"
                    id="confirmation-code"
                    className={`loginCode`}
                    fields={5}
                    value={code}
                    onChange={(value) => {
                      setCode(value);
                      setSubmitDisabled(value.length === 5 ? false : true);
                    }}
                    {...styleProps}
                  />
                </div>
              </div>
              <div
                className={`${classes.buttonWrapper} ${
                  submitting ? styles.submitting : null
                } ${styles.submitWrap} `}
              >
                <button
                  type="submit"
                  fullWidth
                  disabled={submitting || submitDisabled}
                  variant="contained"
                  color="primary"
                  className={`${classes.submit} ${styles.submitButton} loginSubmit`}
                >
                  Sign In
                </button>
              </div>
              <div className={styles.loginHelp}>
                <p>
                  <strong>
                    if you’re having a problem with your
                    <br />
                    login code{" "}
                    <a
                      href="#"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   if (window.Beacon) {
                      //     window.Beacon("open");
                      //   }
                      // }}
                    >
                      contact support
                    </a>
                    .
                  </strong>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Grid>
    </div>
  );
}
