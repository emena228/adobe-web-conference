import { useSession } from "next-auth/client";
import { get } from "lodash";

export default function Protected({ children }) {
  const [session, loading] = useSession();
  const isAdmin = get(session, "user.admin", false);
  return (
    <>
      {!loading && (
        <>
          {isAdmin ? (
            <>{children}</>
          ) : (
            <div>
              <h2>Not authorized</h2>
            </div>
          )}
        </>
      )}
    </>
  );
}
