import React, { useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import adminLoaderGif from "@images/admin-loader.gif";
import DialogTitle from "@material-ui/core/DialogTitle";

const Search = ({ open = false, closeFunc = () => {} }) => {
  const [results, setResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const emailInput = useRef();
  const router = useRouter();
  const handleClose = () => {
    closeFunc(false);
  };

  const formSearch = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = async () => {
    const emailValue = emailInput.current.value;

    if (!emailValue) {
      return;
    }

    setResults("");
    setSearching(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/users/search/email?` +
        new URLSearchParams({
          email: emailValue,
        })
    );
    const { users } = await response.json();

    setSearching(false);

    if (users) {
      if (users[0]) {
        router.push(`/manage/users/edit/${users[0]._id}`);
      } else {
        setResults("No results");
      }
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={formSearch}>
        <DialogTitle id="form-dialog-title">Open User by Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the participant email address:
          </DialogContentText>
          <TextField
            autoFocus
            inputRef={emailInput}
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          {searching && <img src={adminLoaderGif} />}
          <span
            style={{
              fontSize: "11px",
              position: "relative",
              top: "-2px",
              marginLeft: "15px",
            }}
          >
            {results}
          </span>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSearch} color="primary">
            Search
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Search;
