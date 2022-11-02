import React from "react";
import { useConferenceState } from "@utils/conference";
import switchDisabledSrc from "@images/switches-new/ui-pos-1-disabled.svg";
import switchGallerySrc from "@images/switches-new/ui-pos-1.svg";
import galleryDisabledSrc from "@images/switches-new/ui-pos-1-icon-disabled.svg";
import gallerySrc from "@images/switches-new/ui-pos-1-icon.svg";
import switchDualViewSrc from "@images/switches-new/ui-pos-2.svg";
import switchPresenterFullSrc from "@images/switches-new/ui-pos-3.svg";
import switchPresentationFullSrc from "@images/switches-new/ui-pos-4.svg";
import viewDualSrc from "@images/switches/ui-dual-view.svg";
import viewPresentationSrc from "@images/switches/ui-presentation-view.svg";
import viewDualDisabledSrc from "@images/switches/ui-dual-view-disabled.svg";
import viewPresenterSrc from "@images/switches/ui-presenter.svg";
import styles from "./switch.module.scss";

const Switch = ({ disabled, onClick }) => {
  const { state } = useConferenceState();
  const { mode, localView } = state;
  const switchDisabled = mode === "grid" || disabled;
  return (
    <div
      className={`${styles.switch} ${switchDisabled ? styles.disabled : ""} `}
      onClick={onClick}
    >
      <div className={styles.switchInner}>
        <div className={styles.switchLeft}>
          {switchDisabled ? (
            <img
              draggable={false}
              style={{ cursor: "not-allowed" }}
              src={switchDisabledSrc}
            />
          ) : (
            <>
              {localView === "grid" && (
                <img draggable={false} src={switchGallerySrc} />
              )}
              {localView === "dualView" && (
                <img draggable={false} src={switchDualViewSrc} />
              )}
              {localView === "presentationFull" && (
                <img draggable={false} src={switchPresentationFullSrc} />
              )}
              {localView === "presenterFull" && (
                <img draggable={false} src={switchPresenterFullSrc} />
              )}
            </>
          )}
        </div>
        <div className={styles.switchRight}>
          {localView === "grid" && <img draggable={false} src={gallerySrc} />}
          {localView === "dualView" && (
            <>
              {switchDisabled ? (
                <img draggable={false} src={viewDualDisabledSrc} />
              ) : (
                <img draggable={false} src={viewDualSrc} />
              )}
            </>
          )}
          {localView === "presentationFull" && (
            <img draggable={false} src={viewPresentationSrc} />
          )}
          {localView === "presenterFull" && (
            <img draggable={false} src={viewPresenterSrc} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Switch;
