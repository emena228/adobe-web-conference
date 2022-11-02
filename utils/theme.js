import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    color: "#333",
  },

  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#ed2123",
      contrastText: "#fff",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#ed2123",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#fff",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },

  overrides: {
    // MuiSnackbar: {
    //   root: {
    //     top: '100px',
    //     position: 'absolute'
    //   }
    // },

    MuiBackdrop: {
      root: {
        backgroundColor: "rgba(0,0,0,0)",
        pointerEvents: "none",
      },
    },

    MuiDialog: {},

    MuiFormControl: {
      root: {
        margin: "0.3rem 0",
      },
    },
    // MuiInputLabel: {
    //   root: {
    //     "&$focused": {
    //       color: "#44a2fc"
    //     }
    //   },
    // },
    MuiInput: {
      // root: {
      //   '&$focused': {
      //     color: "#44a2fc"
      //   }
      // },
      underline: {
        "&:before": {
          borderBottom: "1px solid #EAEAEA",
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: "2px solid #EAEAEA",
        },
        "&$focused": {
          "&:after": {
            borderBottom: "2px solid #44a2fc",
          },
        },
        // root: {

        // backgroundColor: '#44a2fc',
        // borderBottom: '1px solid red'
        // }
      },
    },
  },
});
