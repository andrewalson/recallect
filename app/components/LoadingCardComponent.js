"use client";
import { useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";

export default function LoadingCardComponent({ flashcard, onClick }) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    onClick();
  };

  return (
    <Card onClick={handleClick} sx={{ position: "relative", cursor: loading ? "not-allowed" : "pointer" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <CardContent>
        <Typography variant="h6">{flashcard.name}</Typography>
      </CardContent>
    </Card>
  );
}
