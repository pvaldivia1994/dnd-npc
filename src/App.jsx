import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Admin from "./pages/Admin";

function NavButtons() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Button
        color={currentPath === "/grupo1" ? "warning" : "inherit"}
        component={Link}
        to="/grupo1"
      >
        Grup-1
      </Button>
      <Button
        color={currentPath === "/grupo2" ? "warning" : "inherit"}
        component={Link}
        to="/grupo2"
      >
        Grup-A
      </Button>
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/dnd-npc">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Raiders of the Serpent
          </Typography>
          <NavButtons />
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/grupo1" element={<Admin grupo="grupo1" />} />
          <Route path="/grupo2" element={<Admin grupo="grupo2" />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
