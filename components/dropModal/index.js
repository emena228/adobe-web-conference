import React from "react";

import styles from "./index.module.scss";

class DropModal extends React.PureComponent {
  state = {};

  hideOnOuterClick = (event) => {
    if (this.props.closeOnOuterClick === false) return;
    if (event.target.dataset.modal && this.props.onClose instanceof Function)
      this.props.onClose(event);
  };

  render() {
    const { style, className, childClassName, children } = this.props;

    return (
      <div
        className={`${styles.modal} ${className}`}
        style={style}
        onClick={this.hideOnOuterClick}
        data-modal="true"
      >
        <div className={`${styles.childContainer}, ${childClassName}`}>
          {children}
        </div>
      </div>
    );
  }
}

export default DropModal;
