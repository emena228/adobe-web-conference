import React, { useState, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { signIn } from "next-auth/client";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "next/link";
import { useRouter } from "next/router";
import { get } from "lodash";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import formSubmitFunc from "@utils/forms/login";
import Typography from "@material-ui/core/Typography";
import adobeHero from "@images/hero.png";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import styles from "./index.module.scss";

function Copyright() {
  return (
    <div style={{ marginTop: "240px" }}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://material-ui.com/">
          Adobe
        </Link>{" "}
        {new Date().getFullYear()}
        {"."} All rights reserved.
      </Typography>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "65vh",
    justifyContent: "center",
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
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const userIdField = useRef();
  const userPasswordField = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const callbackUrl = get(
    router.query,
    "callback",
    process.env.NEXT_PUBLIC_SITE_URL
  );

  // const onFormSubmit = (e) => {
  //   const userId = get(userIdField, "current.value", "");
  //   const password = get(userPasswordField, "current.value", "");

  //   e.preventDefault();
  //   formSubmitFunc({
  //     setSubmitting,
  //     setErrors,
  //     signIn,
  //     callbackUrl,
  //     errors,
  //     userId,
  //     password,
  //   });
  // };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={styles.logoWrap}>
          <img src={adobeHero} />
        </div>
        {/* <Typography component="h1" variant="h5">
          Sign in
        </Typography> */}
        <h3>Authentication Required</h3>
        {/* <form className={classes.form} noValidate onSubmit={onFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={userIdField}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            inputRef={userPasswordField}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={`${classes.submit} loginSubmit`}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Login support
              </Link>
            </Grid>
        
          </Grid>
        </form> */}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
