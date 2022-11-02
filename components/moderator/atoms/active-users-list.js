import React, {
  useCallback,
  FunctionComponent,
  useReducer,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import CachedIcon from "@material-ui/icons/Cached";
import styles from "./active-users-list.module.scss";
import { ActiveUser } from "./active-user";
import { useNotificationState } from "@utils/notifications.js";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

export const ActiveUsersList = ({ refreshFunc, ajaxLoading }) => {
  const { state } = useNotificationState();
  const [stopOnScroll, setStopOnScroll] = useState(false);
  const activeUserEndRef = useRef(null); //This is our reference to the instance of this component in the DOM

  const { activeUsers } = state;

  const scrollToBottom = () => {
    activeUserEndRef?.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  useScrollPosition(({ prevPos, currPos }) => {
    const isShow = currPos.y > prevPos.y;

    if (isShow !== stopOnScroll) setStopOnScroll(isShow);
  }, []);

  useEffect(scrollToBottom, [state.activeUsers]);

  const ActiveUsers = [...activeUsers.values()].map((user, i) => {
    if (!user) {
      return;
    }
    const { _id } = user;
    return (
      <React.Fragment key={_id}>
        <ActiveUser activeUser={user} />
        <div ref={activeUserEndRef} />
      </React.Fragment>
    );
  });

  return (
    <div className={styles.activeUsersList}>
      <div>
        <div className={styles.activeUsersHeader}>
          Active Users
          <div className={styles.activeUsersOccupancy}>{activeUsers.size}</div>
        </div>
        <button
          className={styles.activeUsersRefresh}
          onClick={() => {
            refreshFunc();
          }}
        >
          <CachedIcon className={ajaxLoading ? styles.rotating : ""} />
        </button>
      </div>
      <div className={styles.activeUsersListWrapper}>{ActiveUsers}</div>
    </div>
  );
};
