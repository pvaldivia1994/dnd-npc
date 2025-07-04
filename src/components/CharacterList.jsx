import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box
} from "@mui/material";
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
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: {
            xs: "center",    // En pantallas xs (móviles) centrar
            sm: "flex-start" // En pantallas sm+ alinear a la izquierda
          }
        }}
      >
        {characters.map((char) => (
          <Grid item key={char.id} xs={12} sm={6} md={4}>
            <CharacterCard
              character={char}
              onEdit={onEdit}
              {...(allowDelete && { onDelete: handleDelete })}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
