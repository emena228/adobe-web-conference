import Head from "next/head";
import Link from "next/link";
import styles from "@scss/error.module.scss";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Adobe Conference | Page Not Found</title>
      </Head>
      <div className={styles.error}>
        <div className={styles.errorInner}>
          {/* <div className={styles.errorLockup}>
            <Link href="/">
              <a>
                <img draggable={false} className={styles.frameLogo} src="#" />
              </a>
            </Link>
          </div> */}
          <h1>We’re sorry the page cannot be found.</h1>
        </div>
      </div>
    </>
  );
}
