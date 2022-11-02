import Modal from "simple-react-modal";
import closeButtonSrc from "@images/ui-close.svg";
import styles from "./index.module.scss";

const Dialog = ({
  children,
  display,
  closeFunc,
  width = "600px",
  containerStyles = {},
}) => {
  return (
    <Modal
      style={{
        backgroundColor: `rgba(109,87,165,0.8)`,
        overflowY: "hidden",
      }}
      containerStyle={{
        borderRadius: "20px",
        overflow: "hidden",
        padding: 0,
        width: width,
        margin: "3% auto",
      }}
      show={display}
      closeOnOuterClick={true}
      onClose={() => {
        closeFunc(false);
      }}
    >
      <div>
        <button
          className={`${styles.dialogClose} jsClose`}
          onClick={() => {
            closeFunc(false);
          }}
        >
          <img src={closeButtonSrc} />
        </button>
        <div style={containerStyles} className={styles.dialogContainer}>
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
