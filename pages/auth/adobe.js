import React, { useEffect } from "react";
import Head from "next/head";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { useNotificationState } from "@utils/notifications.js";
import heroSrc from "@images/hero-loading.png";
import styles from "@scss/home.module.scss";

const Home = () => {
  const [session, loading] = useSession();
  const { state, methods } = useNotificationState();
  const {
    channelData: { view },
  } = state;
  const router = useRouter();

  const { query } = router;

  const { error } = query;

  useEffect(() => {
    if (session) router.push(`/`);
  }, [session]);

  useEffect(() => {
    const { t, error } = query;
    if (!t || session) {
      return;
    }

    signIn("loginurl", { token: t, callbackUrl: "/" });
  }, [query]);

  return (
    <div>
      <Head>
        <title>Adobe Executive Summer Forum</title>
      </Head>
      <div className={styles.authTokenSplash}>
        <div>
          <img className={styles.authTokenSplashHero} src={heroSrc} />
          {!error && <h2>Authenticating...</h2>}
          {error === "invalid-credentials" && <h2>Invalid Token</h2>}
        </div>
      </div>
    </div>
  );
};

export default Home;
