import Head from "next/head";
// import Scratch from "../components/scratch";
import { useEffect } from "react";
import Router from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import { get } from "lodash";
import Layout from "@components/layout";
import Protected from "@components/admin/protected";
import Moderator from "@components/moderator";
import dynamic from "next/dynamic";
import styles from "@scss/home.module.scss";

export default function ModeratorPage() {
  const [session, loading] = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <title>Moderator</title>
      </Head>

      <Layout>
        <Protected>
          <div className={styles.moderatorWrapper}>
            <Moderator />
          </div>
        </Protected>
      </Layout>
      {/* <footer className={styles.footer}></footer> */}
    </div>
  );
}
