import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export default function WindowAction() {
  const closeWindow = () => {
    window.electron.ipcRenderer.closeWindow();
  };
  const minimizeWindow = () => {
    window.electron.ipcRenderer.minimizeWindow();
  };

  return (
    <>
      <IconButton aria-label="minimize" size="medium" onClick={minimizeWindow}>
        <RemoveIcon fontSize="inherit" />
      </IconButton>

      <IconButton aria-label="close" size="medium" onClick={closeWindow}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </>
  );
}
