import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { get } from "lodash";
import adobeHero from "@images/hero-loading.png";
import styles from "./index.module.scss";

const ProtectedContent = ({ children }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  const user = get(session, "user", false);

  useEffect(() => {
    if (!session || !user) router.replace("/sign-in");
  }, [session, user]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>
          <img
            draggable={false}
            className={styles.loadingIcon}
            src={adobeHero}
          />
        </div>
      </div>
    );
  }

  return user ? children : null;
};

export default ProtectedContent;
