import React, { useState, useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import { debounce } from "lodash";
import Switch from "@material-ui/core/Switch";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import statuses from "@utils/config/status.js";
import styles from "./index.module.scss";

// import {
//   getEncodedForm,
//   getFileName,
//   assetUrlToCloudfrontUrl,
// } from "@utils/js/functions";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100%",
  },
  textField: {
    width: "100%",
  },
  selectField: {
    width: "100%",
  },
}));

const mStyles = (theme) => ({
  textField: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
});

const ChannelEditor = ({
  data = null,
  formSubmitFunc = () => {},
  fileChangeFunc = () => {},
  filePreviewFunc = () => {},
}) => {
  const classes = useStyles();
  const channelHostSearch = useRef();
  const [formData, setFormData] = useState(data || {});

  const [userQuery, setUserQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const searchUsers = debounce(async (query) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/users/search?` +
        new URLSearchParams({
          name: query,
        })
    );
    const { users } = await response.json();
    if (users) {
      setOptions(users);
    }
  }, 300);

  const updateField = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };
  const { name, uid, status, channelHost } = formData;

  return (
    <section className={styles.channelEditor}>
      <div className={styles.channelEditorInner}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formSubmitFunc(formData);
          }}
        >
          <div>
            <h1>{data ? "Edit Channel" : "Create Channel"}</h1>
          </div>

          <div className={styles.channelEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="name"
                value={name}
                variant="outlined"
                className={classes.textField}
                label="Name"
                onChange={(e) => {
                  updateField("name", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className={styles.channelEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="uid"
                value={uid}
                variant="outlined"
                className={classes.textField}
                label="UID"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  updateField("uid", value);
                }}
                inputProps={{ pattern: "[a-z]{1,15}" }}
              />
            </FormControl>
          </div>

          <div className={styles.channelEditorField}>
            <FormControl variant="filled" label="Status" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={status}
                className={classes.selectField}
                onChange={(e) => {
                  updateField("status", e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>Status</em>
                </MenuItem>
                {statuses &&
                  statuses.map(({ label, value }) => {
                    return <MenuItem value={value}>{label}</MenuItem>;
                  })}
              </Select>
            </FormControl>
          </div>

          <div className={styles.channelEditorField}>
            <FormControl variant="filled" fullWidth>
              <Autocomplete
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                onChange={(e, value) => {
                  updateField("channelHost", value);
                }}
                getOptionSelected={(option, value) =>
                  option._id === channelHost._id
                }
                value={channelHost}
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Channel Host"
                    variant="outlined"
                    inputRef={channelHostSearch}
                    onKeyUp={(event) => {
                      if (event.target.value.length > 3) {
                        searchUsers(event.target.value);
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
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

export default ChannelEditor;
