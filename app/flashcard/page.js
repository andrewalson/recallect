"use client"

import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("id");  // This is the collection ID (or name in your case)

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        console.log("Missing search parameter or user data");
        return;
      }
      try {
        const colRef = collection(db, `users/${user.id}/${search}`);
        const docs = await getDocs(colRef);
        const flashcardsData = [];

        docs.forEach((doc) => {
          flashcardsData.push({ id: doc.id, ...doc.data() });
        });

        setFlashcards(flashcardsData);
        setFlipped(new Array(flashcardsData.length).fill(false));
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }
    getFlashcard();
  }, [user, search]);

  if (!isLoaded || !isSignedIn) return <></>;

  const handleFlip = (index) => {
    setFlipped((prevFlipped) => {
      const newFlipped = [...prevFlipped];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  // Navigate to the test page and pass the collection ID
  const handleLearnClick = () => {
    if (search) {
      router.push(`/flashcard/test?id=${search}`);
    } else {
      console.error("No collection ID available for navigation.");
    }
  };

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleFlip(index)}>
                <CardContent>
                  <div
                    style={{
                      perspective: "1000px",
                      transition: "transform 0.6s",
                      transformStyle: "preserve-3d",
                      position: "relative",
                      width: "100%",
                      height: "200px",
                      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                      transform: flipped[index]
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 16,
                        boxSizing: "border-box",
                      }}
                    >
                      <Typography variant="h5">{flashcard.front}</Typography>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 16,
                        boxSizing: "border-box",
                      }}
                    >
                      <Typography variant="h5">{flashcard.back}</Typography>
                    </div>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4, mb: 4 }}>
        <Button href="/flashcards" variant="contained">
          Go back
        </Button>
        <Button
          variant="contained"
          onClick={handleLearnClick}  // Navigate to test page with collection ID
          sx={{
            backgroundColor: "red",
            "&:hover": { backgroundColor: "#8B0000" },
          }}
        >
          Learn
        </Button>
      </Stack>
    </Container>
  );
}
