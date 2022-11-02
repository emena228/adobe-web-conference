import { useEffect, useState } from "react";
import Head from "next/head";
import UserEditor from "@components/admin/user-editor";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import Protected from "@components/admin/protected";
import CheckIcon from "@material-ui/icons/Check";
import Alert from "@material-ui/lab/Alert";
import { getSession } from "next-auth/client";
import { get } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: "150px",
  },
  container: {
    marginTop: "80px",
  },
}));

function NewUser({ query, session }) {
  const classes = useStyles();
  const router = useRouter();
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const formSubmitFunc = (values) => {
    fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/users/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values,
        json: true,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((response) => {
        const { success, text = "" } = response;
        if (success) {
          setAlertType("success");
          setAlertMessage(text);
          setTimeout(() => {
            router.push({
              pathname: "/manage/users",
            });
          }, 1.5 * 1000);
        } else if (text === "duplicate_user_email") {
          setAlertMessage("An account already exists with this email address.");
          setAlertType("error");
        }
      });
  };

  return (
    <div>
      <Head>
        <title>New User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="none" className={classes.container}>
          <Protected>
            <>
              {alertMessage && (
                <Alert
                  variant="filled"
                  icon={<CheckIcon fontSize="inherit" />}
                  severity={alertType}
                >
                  {alertMessage}
                </Alert>
              )}
              <UserEditor formSubmitFunc={formSubmitFunc} />
            </>
          </Protected>
        </Container>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { params } = context;
  return {
    props: {
      session,
    },
  };
}

export default NewUser;
