import { SignUp } from "@clerk/nextjs";
import { Box, Button, Container } from "@mui/material";
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
        minHeight: "100vh", // Ensure the container takes the full screen height
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center content horizontally
        }}
      >
        <SignUp />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        width="100%"
        mt={2}
      >
        <Button variant="text" component={Link} href="/sign-in">
          Already have an account? Sign In
        </Button>
      </Box>
    </Container>
  );
}
