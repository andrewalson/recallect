"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter, useSearchParams } from "next/navigation";

export default function Test() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState(0); // User's difficulty rating
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionName = searchParams.get("id"); // Get the collection name from the URL

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

    // Calculate percentOverdue
    const now = Date.now();
    const daysSinceLastReview = (now - currentCard.dateLastReviewed) / (24 * 60 * 60 * 1000);
    const percentOverdue = Math.min(2.0, daysSinceLastReview / currentCard.daysBetweenReviews);

    // Calculate performance rating based on difficulty (0-1 scale)
    const performanceRating = (6 - difficulty) / 5;

    // Update difficulty
    let newDifficulty = currentCard.difficulty + percentOverdue * (1 / 17) * (8 - 9 * performanceRating);
    newDifficulty = Math.max(0.0, Math.min(1.0, newDifficulty));

    // Update days between reviews
    let newDaysBetweenReviews = currentCard.daysBetweenReviews * (1 + (3 - 1) * percentOverdue * Math.random() * 1.05);
    if (performanceRating < 0.6) {
      newDaysBetweenReviews = 1 / (1 + 3 * newDifficulty); // Reset interval if incorrect
    }

    // Update consecutive correct answers
    const newConsecutiveCorrectAnswers = performanceRating >= 0.6 ? currentCard.consecutiveCorrectAnswers + 1 : 0;

    // Prepare the updated card
    const updatedCard = {
      ...currentCard,
      difficulty: newDifficulty,
      daysBetweenReviews: newDaysBetweenReviews,
      dateLastReviewed: now,
      consecutiveCorrectAnswers: newConsecutiveCorrectAnswers,
    };

    // Update Firestore in the correct subcollection
    await updateDoc(doc(db, `users/${user.id}/${collectionName}`, currentCard.id), updatedCard);

    // Reset state for the next card
    setShowAnswer(false);
    setDifficulty(0);
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
  };

  const handlePauseAndExit = () => {
    // Redirect the user back to the flashcards overview page
    router.push(`/flashcards?id=${collectionName}`);
  };

  if (!isLoaded || !isSignedIn) return <></>;

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Loading flashcards...</Typography>
      </Container>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">No flashcards available.</Typography>
        <Button variant="contained" onClick={() => router.push("/flashcards")}>
          Go Back to Flashcards
        </Button>
      </Container>
    );
  }

  if (currentCardIndex >= flashcards.length) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Review Complete!</Typography>
        <Button variant="contained" onClick={() => router.push("/flashcards")}>
          Go Back to Flashcards
        </Button>
      </Container>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6">
        Card {currentCardIndex + 1} of {flashcards.length}
      </Typography>

      <Card onClick={() => setShowAnswer(true)}>
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
              Rate difficulty:
            </Typography>
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
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ mt: 2, display: 'block', mx: 'auto' }}
          disabled={!showAnswer || !difficulty}
        >
          Next Card
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePauseAndExit}
          sx={{ mt: 2, display: 'block', mx: 'auto' }}
        >
          Pause and Exit
        </Button>
      </Box>
    </Container>
  );
}
