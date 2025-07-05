import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import CharacterCard from "./CharacterCard";

export default function CharacterList({ onEdit, allowDelete = false }) {
  const [characters, setCharacters] = useState([]);

  async function fetchCharacters() {
    const snapshot = await getDocs(collection(db, "characters"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCharacters(data);
  }

  useEffect(() => {
    fetchCharacters();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar personaje?")) return;
    await deleteDoc(doc(db, "characters", id));
    fetchCharacters();
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          columnCount: {
            xs: 1,
            sm: 2,
            md: 3,
          },
          columnGap: 16,
        }}
      >
        {characters.map((char) => (
          <Box key={char.id} sx={{ breakInside: "avoid", mb: 2 }}>
            <CharacterCard
              character={char}
              onEdit={onEdit}
              {...(allowDelete && { onDelete: handleDelete })}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
