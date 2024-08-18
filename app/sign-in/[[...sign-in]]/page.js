import { SignIn } from "@clerk/nextjs";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full screen height for centering
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome Back
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please Sign In to Continue
      </Typography>

      <Box
        sx={{
          width: "100%",
          mt: 3,
          mb: 3,
        }}
      >
        <SignIn />
      </Box>

      <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
        <Button variant="text" component={Link} href="/sign-up" fullWidth>
          Don’t have an account? Sign Up
        </Button>
      </Box>
    </Container>
  );
}
