import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";

import styles from "./multi-switch.module.scss";

const MultiSwtich = ({
  className,
  disabled = false,
  options = [],
  selected = "",
  onChange = () => {},
  ...props
}) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className={cx(styles.multiSwtich, className)} {...props}>
      {options.map(({ label, alt, value }) => (
        <div
          key={value}
          title={alt}
          alt={alt}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          className={cx(
            styles.multiSwtichButton,
            value === selected && styles.active
          )}
          onClick={() => {
            if (disabled) {
              return;
            }
            onChange(value, label);
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

MultiSwtich.propTypes = {
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      alt: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export default MultiSwtich;
