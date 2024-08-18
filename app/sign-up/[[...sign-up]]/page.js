import { SignUp } from "@clerk/nextjs";
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
        Join Us Today
      </Typography>
      <Typography variant="h6" gutterBottom>
        Create your account to get started
      </Typography>

      <Box
        sx={{
          width: "100%",
          mt: 3,
          mb: 3,
        }}
      >
        <SignUp />
      </Box>

      <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
        <Button variant="text" component={Link} href="/sign-in" fullWidth>
          Already have an account? Sign In
        </Button>
      </Box>
    </Container>
  );
}
