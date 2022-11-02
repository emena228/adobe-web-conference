import { useCallback, useState, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";

import DropModal from "@components/dropModal";
import closeButtonSrc from "@images/ui-close.svg";
import globalStyles from "@scss/global.module.scss";
import styles from "./index.module.scss";

const Dialog = ({
  children,
  display,
  closeFunc,
  width = 600,
  containerStyles = {},
}) => {
  const handleClose = useCallback(() => {
    if (closeFunc) closeFunc(false);
  }, [closeFunc]);

  return (
    <Transition enter exit in={display} timeout={0}>
      {(state) => {
        return (
          <DropModal
            className={`${display ? styles.active : ""} ${styles.dropModal} ${
              globalStyles.opacityAnimation
            } ${globalStyles[state]}`}
            childClassName={`${globalStyles.slideAnimation} ${globalStyles[state]}`}
            closeOnOuterClick={true}
            onClose={handleClose}
          >
            <div className={styles.inner} style={{ width }}>
              <div
                style={containerStyles}
                className={`${styles.dialogContainer}`}
              >
                <button
                  className={`${styles.dialogClose} jsClose`}
                  onClick={handleClose}
                >
                  <img src={closeButtonSrc} />
                </button>
                {children}
              </div>
            </div>
          </DropModal>
        );
      }}
    </Transition>
  );
};

export default Dialog;
