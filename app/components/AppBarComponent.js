'use client';

import { AppBar, Toolbar, Typography, Box, Switch, Button } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function AppBarComponent({ darkMode, setDarkMode }) {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
          recallect
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <LightModeIcon />
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="default"
          />
          <DarkModeIcon />
        </Box>
        <SignedOut>
          <Button color="inherit" href="/sign-in">Login</Button>
          <Button color="primary" variant="contained" href="/sign-up">Sign Up</Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}
