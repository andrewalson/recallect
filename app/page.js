'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import Head from "next/head";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DevicesIcon from '@mui/icons-material/Devices';
import AppBarComponent from './components/AppBarComponent';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useUser();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  const handleCheckout = async (subscriptionLevel) => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionLevel }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received from the server');
      }
    } catch (error) {
      console.error('Error in creating checkout session:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Head>
          <title>Flashcard SaaS</title>
          <meta name="description" content="Create flashcards from your text" />
        </Head>

        <AppBarComponent darkMode={darkMode} setDarkMode={setDarkMode} />

        <Box sx={{ 
          textAlign: "center", 
          py: 12,
          background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
          color: 'white',
          borderRadius: { xs: 0, sm: 2 },
          mx: { xs: 0, sm: 4 },
          my: 4,
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        }}>
          <SignedIn>
            <Typography variant="h2" gutterBottom>
              Welcome <span style={{ color: '#1b305b' }}>{user?.fullName}</span>
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
              The easiest way to make flashcards from your text
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }} 
                href="/generate"
              >
                Generate Flashcards
              </Button>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }} 
                href="/flashcards"
              >
                View Flashcards
              </Button>
            </Stack>
          </SignedIn>
          <SignedOut>
            <Typography variant="h2" gutterBottom>
              Welcome to <span style={{ color: '#1b305b' }}>Recallect</span>
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
              The easiest way to make flashcards from your text
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }} 
              href="/sign-in"
            >
              Get Started
            </Button>
          </SignedOut>
        </Box>

        <Container maxWidth="lg">
          <Box sx={{ my: 12 }}>
            <Typography variant="h3" gutterBottom textAlign="center" color="primary" mb={6}>
              Features
            </Typography>
            <Grid container spacing={4}>
              {[
                { icon: <TextFieldsIcon />, title: "Easy Text Input", description: "Just paste your text and we will do the rest. Creating flashcards has never been easier." },
                { icon: <PsychologyIcon />, title: "Smart Flashcards", description: "Our AI intelligently breaks down your text into concise flashcards, perfect for studying." },
                { icon: <DevicesIcon />, title: "Spaced", description: "Access your flashcards from any device, at any time. Study on the go with ease." },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Box sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 12, textAlign: "center" }}>
            <Typography variant="h3" gutterBottom color="primary" mb={6}>Pricing</Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                { title: "Basic", price: "$5", description: "Access to basic flashcard features and limited storage.", priceId: 'price_basic' },
                { title: "Pro", price: "$10", description: "Unlimited flashcards and storage, with priority support.", priceId: 'price_pro' },
              ].map((plan, index) => (
                <Grid item xs={12} sm={6} md={5} key={index}>
                  <Card elevation={3}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        {plan.title}
                      </Typography>
                      <Typography variant="h4" gutterBottom color="primary" sx={{ my: 3 }}>
                        {plan.price} <Typography component="span" variant="subtitle1">/ month</Typography>
                      </Typography>
                      <Typography sx={{ mb: 4, minHeight: '60px' }}>
                        {plan.description}
                      </Typography>
                      <Button 
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => handleCheckout(plan.priceId)}
                        sx={{ py: 1.5 }}
                      >
                        Choose {plan.title}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
