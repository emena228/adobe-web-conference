import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import styles from "./settings.module.scss";

const Settings = (props) => {
  const {
    audioDevices,
    videoDevices,
    currentAudioDeviceId,
    currentVideoDeviceId,
    audioDeviceChangeHandle,
    videoDeviceChangeHandle,
  } = props;

  const formSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles.settings}>
      <h2>Settings</h2>
      <FormControl className={styles.formControl} onSubmit={formSubmit}>
        <InputLabel id="microphone-label">Microphone Options</InputLabel>
        <Select
          labelId="microphone-label"
          value={currentAudioDeviceId}
          onChange={(e) => {
            audioDeviceChangeHandle(e.target.value);
          }}
        >
          {audioDevices.map((device, index) => {
            return (
              <MenuItem
                className={styles.menuItem}
                value={device.deviceId}
                key={index}
              >
                {device.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl className={styles.formControl} onSubmit={formSubmit}>
        <InputLabel id="camera-label">Camera Options</InputLabel>
        <Select
          labelId="camera-label"
          value={currentVideoDeviceId}
          onChange={(e) => {
            videoDeviceChangeHandle(e.target.value);
          }}
        >
          {videoDevices.map((device, index) => {
            return (
              <MenuItem
                className={styles.menuItem}
                value={device.deviceId}
                key={index}
              >
                {device.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default Settings;
