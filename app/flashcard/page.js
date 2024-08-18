"use client";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  Stack,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useSearchParams, useRouter } from "next/navigation";
import AppBarComponent from "../components/AppBarComponent";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        console.error("Missing search parameter or user data");
        return;
      }
      try {
        const colRef = collection(db, `users/${user.id}/${search}`);
        const docs = await getDocs(colRef);
        const flashcards = [];

        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });

        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }
    getFlashcard();
  }, [user, search]);

  const handleFlip = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLearnClick = () => {
    if (search) {
      setLoading(true); // Start loading animation
      router.push(`/flashcard/test?id=${search}`);
    } else {
      console.error("No collection ID available for navigation.");
    }
  };

  const handleGoBack = () => {
    setLoading(true); // Start loading animation
    router.push("/flashcards");
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: "#2196f3",
        },
      },
    });
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  if (!isLoaded || !isSignedIn) return <></>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <AppBarComponent darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardActionArea onClick={() => handleFlip(index)}>
                        <CardContent>
                          <Box
                            sx={{
                              perspective: "1000px",
                              "& > div": {
                                transition: "transform 0.6s",
                                transformStyle: "preserve-3d",
                                position: "relative",
                                width: "100%",
                                height: "200px",
                                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                                transform: flipped[index]
                                  ? "rotateY(180deg)"
                                  : "rotateY(0deg)",
                              },
                              "& > div > div": {
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 2,
                                boxSizing: "border-box",
                              },
                              "& > div > div:nth-of-type(2)": {
                                transform: "rotateY(180deg)",
                              },
                            }}
                          >
                            <div>
                              <div>
                                <Typography variant="h5" component="div">
                                  {flashcard.front}
                                </Typography>
                              </div>
                              <div>
                                <Typography variant="h5" component="div">
                                  {flashcard.back}
                                </Typography>
                              </div>
                            </div>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{ mt: 4, mb: 4 }}
              >
                <Button variant="contained" onClick={handleGoBack}>
                  Go back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLearnClick}
                  sx={{
                    backgroundColor: "red",
                    "&:hover": { backgroundColor: "#8B0000" },
                  }}
                >
                  Learn
                </Button>
              </Stack>
            </>
          )}
        </Container>
      </Container>
    </ThemeProvider>
  );
}
