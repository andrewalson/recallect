"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import AppBarComponent from "../components/AppBarComponent";
import LoadingCardComponent from "../components/LoadingCardComponent";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        const flashcardsWithIds = collections.map((flashcard, index) => ({
          id: flashcard.name || `generated-id-${index}`,
          ...flashcard,
        }));
        setFlashcards(flashcardsWithIds);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);


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

  const handleCardClick = (id) => {
    if (!id) {
      console.error("Flashcard ID is undefined");
      return;
    }
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <AppBarComponent darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <LoadingCardComponent
                  flashcard={flashcard}
                  onClick={() =>
                    handleCardClick(flashcard.name || `generated-id-${index}`)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
