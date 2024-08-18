"use client";

import { useState, useEffect, useMemo } from "react";
import { Container, Typography, Button, Box, Card, CardContent, CircularProgress, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter, useSearchParams } from "next/navigation";
import AppBarComponent from "../../components/AppBarComponent";

export default function Test() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionName = searchParams.get("id");

  useEffect(() => {
    async function fetchFlashcards() {
      if (!user || !collectionName) {
        console.log("Missing user or collection name.");
        return;
      }

      setIsLoading(true);
      try {
        const colRef = collection(db, `users/${user.id}/${collectionName}`);
        const docs = await getDocs(colRef);
        const flashcardsData = [];

        docs.forEach((doc) => {
          let cardData = doc.data();
          cardData.difficulty = cardData.difficulty || 0.3;
          cardData.daysBetweenReviews = cardData.daysBetweenReviews || 1;
          cardData.dateLastReviewed = cardData.dateLastReviewed || Date.now();
          cardData.consecutiveCorrectAnswers = cardData.consecutiveCorrectAnswers || 0;

          flashcardsData.push({ id: doc.id, ...cardData });
        });

        if (flashcardsData.length > 0) {
          flashcardsData.sort((a, b) => {
            const aOverdue = (Date.now() - a.dateLastReviewed) / (a.daysBetweenReviews * 24 * 60 * 60 * 1000);
            const bOverdue = (Date.now() - b.dateLastReviewed) / (b.daysBetweenReviews * 24 * 60 * 60 * 1000);
            return bOverdue - aOverdue;
          });

          setFlashcards(flashcardsData);
        } else {
          console.log("No flashcards found.");
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFlashcards();
  }, [user, collectionName]);

  const handleNext = async () => {
    const currentCard = flashcards[currentCardIndex];

    const now = Date.now();
    const daysSinceLastReview = (now - currentCard.dateLastReviewed) / (24 * 60 * 60 * 1000);
    const percentOverdue = Math.min(2.0, daysSinceLastReview / currentCard.daysBetweenReviews);

    const performanceRating = (6 - difficulty) / 5;

    let newDifficulty = currentCard.difficulty + percentOverdue * (1 / 17) * (8 - 9 * performanceRating);
    newDifficulty = Math.max(0.0, Math.min(1.0, newDifficulty));

    let newDaysBetweenReviews = currentCard.daysBetweenReviews * (1 + (3 - 1) * percentOverdue * Math.random() * 1.05);
    if (performanceRating < 0.6) {
      newDaysBetweenReviews = 1 / (1 + 3 * newDifficulty);
    }

    const newConsecutiveCorrectAnswers = performanceRating >= 0.6 ? currentCard.consecutiveCorrectAnswers + 1 : 0;

    const updatedCard = {
      ...currentCard,
      difficulty: newDifficulty,
      daysBetweenReviews: newDaysBetweenReviews,
      dateLastReviewed: now,
      consecutiveCorrectAnswers: newConsecutiveCorrectAnswers,
    };

    await updateDoc(doc(db, `users/${user.id}/${collectionName}`, currentCard.id), updatedCard);

    setShowAnswer(false);
    setDifficulty(0);
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
  };

  const handlePauseAndExit = () => {
    router.push(`/flashcards?id=${collectionName}`);
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

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBarComponent darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading flashcards...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (flashcards.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBarComponent darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h5">No flashcards available.</Typography>
          <Button variant="contained" onClick={() => router.push("/flashcards")} sx={{ mt: 2 }}>
            Go Back to Flashcards
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  if (currentCardIndex >= flashcards.length) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBarComponent darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h5">Review Complete!</Typography>
          <Button variant="contained" onClick={() => router.push("/flashcards")} sx={{ mt: 2 }}>
            Go Back to Flashcards
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBarComponent darkMode={darkMode} setDarkMode={toggleDarkMode} />
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">
          Card {currentCardIndex + 1} of {flashcards.length}
        </Typography>

        <Card
          onClick={() => setShowAnswer(true)}
          sx={{
            mt: 4,
            boxShadow: 3,
            cursor: "pointer",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h5">
              {showAnswer ? currentCard.back : currentCard.front}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4 }}>
          {showAnswer && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Rate Difficulty:
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "contained" : "outlined"}
                    onClick={() => setDifficulty(level)}
                    sx={{ mx: 1 }}
                  >
                    {level}
                  </Button>
                ))}
              </Box>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ mt: 4, width: "100%" }}
            disabled={!showAnswer || !difficulty}
          >
            Next Card
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePauseAndExit}
            sx={{ mt: 2, width: "100%" }}
          >
            Pause and Exit
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
