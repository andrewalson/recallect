// pages/api/saveFlashcards.js

import { getDoc, doc, collection, writeBatch } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the import to your Firebase config

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, flashcards, user } = req.body;

      if (!name || !user || !flashcards) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const batch = writeBatch(db);
      const userDocRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        if (collections.find((f) => f.name === name)) {
          return res
            .status(400)
            .json({ error: "Flashcard collection with the same name already exists." });
        } else {
          collections.push({ name });
          batch.set(userDocRef, { flashcards: collections }, { merge: true });
        }
      } else {
        batch.set(userDocRef, { flashcards: [{ name }] });
      }

      const colRef = collection(userDocRef, name);
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, flashcard);
      });

      await batch.commit();
      res.status(200).json({ message: "Flashcards saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save flashcards" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}