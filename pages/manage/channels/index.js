import { useEffect, useState } from "react";
import Head from "next/head";
import DataTable from "@components/admin/dashboard/atoms/data-table";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Layout from "@components/layout";
import Protected from "@components/admin/protected";
import { signIn, signOut, useSession } from "next-auth/client";
import { get } from "lodash";
import styles from "@scss/home.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: "150px",
  },
  container: {
    marginTop: "80px",
  },
}));

export default function ChannelsList() {
  const classes = useStyles();
  const [channels, setChannels] = useState();
  const [session, loading] = useSession();

  async function fetchData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/list`);
    const { channels } = await res.json();
    setChannels(channels);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    { id: "uid", numeric: false, disablePadding: true, label: "UID" },
  ];

  return (
    <div>
      <Head>
        <title>Channels</title>
      </Head>
      <Layout>
        <Container maxWidth="none" className={classes.container} style={{ backgroundColor: "white" }}>
          <Protected>
            <div className={styles.channelManagerWrapper}>
              <DataTable title="Channels" url="/manage/channels" rows={channels} headCells={headCells} />
            </div>
          </Protected>
        </Container>
      </Layout>
    </div>
  );
}
