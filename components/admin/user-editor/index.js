import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { get } from "lodash";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import md5 from "md5";
import styles from "./index.module.scss";

// import {
//   getEncodedForm,
//   getFileName,
//   assetUrlToCloudfrontUrl,
// } from "@utils/js/functions";

const UserEditor = ({
  data,
  formSubmitFunc = () => {},
  fileChangeFunc = () => {},
  filePreviewFunc = () => {},
}) => {
  const [formData, setFormData] = useState(data);
  const updateField = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };
  const {
    _id,
    firstName,
    lastName,
    email,
    company,
    loginCode,
    admin,
    token,
    defaultOnStage,
  } = formData || {};

  return (
    <section className={styles.userEditor}>
      <div className={styles.userEditorInner}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formSubmitFunc(formData);
          }}
        >
          <div>
            <h1>{data ? "Edit Attendee" : "Create Attendee"}</h1>
          </div>

          <div className={styles.userEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => {
                  updateField("firstName", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className={styles.userEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                defaultValue={lastName}
                onChange={(e) => {
                  updateField("lastName", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className={styles.userEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="company"
                label="Company"
                variant="outlined"
                defaultValue={company}
                onChange={(e) => {
                  updateField("company", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className={styles.userEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="email"
                label="E-mail"
                variant="outlined"
                defaultValue={email}
                onChange={(e) => {
                  updateField("email", e.target.value);
                }}
              />
            </FormControl>
          </div>
          {/* <div className={styles.userEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="password"
                label={data ? "Set New Password" : "Password"} //"Password"
                variant="outlined"
                type="password"
                defaultValue={loginCode}
                onChange={(e) => {
                  updateField("password", e.target.value);
                }}
              />
            </FormControl>
          </div> */}

          {firstName && lastName && (
            <div className={styles.userEditorField}>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="password"
                  label={"Access Link"}
                  variant="outlined"
                  type="text"
                  disabled
                  // defaultValue={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/adobe/?e=${email}&t=${_id}`}
                  defaultValue={`${
                    token
                      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/adobe/?t=${token}`
                      : "Please re-save to view token"
                  }`}
                />
              </FormControl>
            </div>
          )}

          <div className={styles.userEditorField}>
            <FormControlLabel
              control={
                <Switch
                  checked={admin}
                  onChange={(e) => {
                    updateField("admin", e.target.checked);
                  }}
                  name="admin"
                />
              }
              label="Admin Access"
            />
          </div>
          <div className={styles.userEditorField}>
            <FormControlLabel
              control={
                <Switch
                  checked={defaultOnStage}
                  onChange={(e) => {
                    updateField("defaultOnStage", e.target.checked);
                  }}
                  name="defaultOnStage"
                />
              }
              label="Attendee is on stage by default"
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={styles.buttonPrimary}
              type="primary"
              htmltype="submit"
            >
              {data ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UserEditor;
