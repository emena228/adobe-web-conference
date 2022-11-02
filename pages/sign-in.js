import { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Login from "@components/login";
import { useRouter } from "next/router";
import { Scrollbar } from "react-scrollbars-custom";
import { useSession } from "next-auth/client";
import styles from "@scss/home.module.scss";

export default function LoginPage() {
  const [session, loading] = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.push(`/`);
  }, [session]);
  return (
    <>
      <Head>
        <title>Sign In | Adobe Executive Summer Forum</title>
      </Head>
      <Scrollbar
        style={{ width: "99.7vw", height: "100vh", top: "2%", zIndex: 60 }}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, style, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  ...style,
                  top: "10px",
                  right: "7px",
                  width: "10px",
                  backgroundColor: "#C4C4C4",
                  borderRadius: "20px",
                  height: "calc(100% - 20px)",
                }}
              />
            );
          },
        }}
        thumbYProps={{
          renderer: (props) => {
            const { elementRef, style, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  ...style,
                  backgroundColor: "#707070",
                  borderRadius: "20px",
                }}
              />
            );
          },
        }}
      >
        <div className={`${styles.container} ${styles.background}`}>
          <Login />
        </div>
      </Scrollbar>
    </>
  );
}
