import { useEffect, useState } from "react";
import Head from "next/head";
import ChannelEditor from "@components/admin/channel-editor";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
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

function EditChannel({ query, session }) {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const { id } = query;

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/get/${id}`);
      const data = await result.json();
      setData(data);
    }

    fetchData();
    return () => {};
  }, [id]);

  const formSubmitFunc = (values) => {
    fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/edit/${id}`, {
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
        const { success, text } = response;
        if (success) {
          setAlertType("success");
          setAlertMessage(text);
          setTimeout(() => {
            setAlertMessage(null);
          }, 3.5 * 1000);
        } else {
          setAlertMessage(text);
          setAlertType("error");
        }
      });
  };

  return (
    <div>
      <Head>
        <title>Edit Channel</title>
      </Head>
      <Layout>
        <Container maxWidth="none" className={classes.container} style={{ backgroundColor: "white" }}>
          <Protected>
            {data && (
              <>
                {alertMessage && (
                  <Alert variant="filled" icon={<CheckIcon fontSize="inherit" />} severity={alertType}>
                    {alertMessage}
                  </Alert>
                )}
                <ChannelEditor data={data} formSubmitFunc={formSubmitFunc} />
              </>
            )}
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
      query: params,
    },
  };
}

export default EditChannel;
