"use client";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        console.log('Missing search parameter or user data');
        console.log('Search parameter (collection name):', search);
        return;
      }
      try {
        console.log('User ID:', user.id); // Debugging line
        console.log('Search parameter:', search); // Debugging line
        const colRef = collection(db, `users/${user.id}/${search}`);
        const docs = await getDocs(colRef);
        const flashcards = [];
  
        docs.forEach((doc) => {
          console.log('Fetched document:', doc.data()); // Debugging line
          flashcards.push({ id: doc.id, ...doc.data() });
        });
  
        console.log('Final flashcards array:', flashcards); // Debugging line
        setFlashcards(flashcards);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
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

  if (!isLoaded || !isSignedIn) return <></>;

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleFlip(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px", // Adjusted perspective for a more pronounced effect
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
                    {/* <main> */}
                    {/* <Spline scene="https://prod.spline.design/HL62aM-o9Ps1-W4g/scene.splinecode" /> */}
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
      <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 4 }}>
        <Button href="/flashcards" variant="contained">
          Go back
        </Button>
      </Box>
    </Container>
  );
}
