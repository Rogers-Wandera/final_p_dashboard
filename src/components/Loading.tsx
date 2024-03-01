import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";

export function LoadingScreen() {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography
          sx={{
            mt: 2,
          }}
        >
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
}
