import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Susbastas de Productos
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
