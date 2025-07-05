import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import CharacterCard from "./CharacterCard";

export default function CharacterList({ onEdit, allowDelete = false, grupo, tagFilter = "todos" }) {
  const [characters, setCharacters] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  async function fetchCharacters() {
    let q;
    const baseRef = collection(db, "characters");

    if (tagFilter === "todos") {
      q = query(baseRef, where("grupo", "==", grupo));
    } else {
      q = query(baseRef, where("grupo", "==", grupo), where("tag", "==", tagFilter));
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCharacters(data);
  }

  useEffect(() => {
    if (grupo) fetchCharacters();
  }, [grupo, tagFilter]);

  function handleDeleteClick(id) {
    setSelectedToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!selectedToDelete) return;
    await deleteDoc(doc(db, "characters", selectedToDelete));
    setDeleteDialogOpen(false);
    setSelectedToDelete(null);
    fetchCharacters();
  }

  function cancelDelete() {
    setDeleteDialogOpen(false);
    setSelectedToDelete(null);
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Lista de personajes */}
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
              {...(allowDelete && { onDelete: () => handleDeleteClick(char.id) })}
            />
          </Box>
        ))}
      </Box>

      {/* Dialogo Confirmacion Eliminar */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este personaje? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
