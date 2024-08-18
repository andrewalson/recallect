'use client';

import { AppBar, Toolbar, Typography, Box, Switch, Button } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import Link from 'next/link';  // Import Link from next/link

export default function AppBarComponent({ darkMode, setDarkMode }) {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
          recallect
        </Typography>

        {/* Add Home Button */}
        <Button color="inherit" component={Link} href="/" sx={{ mr: 2 }}>
          Home
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <LightModeOutlinedIcon />
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="default"
          />
          <DarkModeOutlinedIcon />
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
