import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import CharacterCard from "./CharacterCard";

export default function CharacterList({
  onEdit,
  allowDelete = false,
  grupo,
  tagFilter = "todos",
  orderField = "name",
  orderDirection = "asc",
  showOG = true, // Recibe showOG para pasar a CharacterCard
}) {
  const [characters, setCharacters] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  async function fetchCharacters() {
    const baseRef = collection(db, "characters");
    let q;

    if (tagFilter === "todos") {
      q = query(baseRef, where("grupo", "==", grupo));
    } else {
      q = query(
        baseRef,
        where("grupo", "==", grupo),
        where("tag", "==", tagFilter)
      );
    }

    const snapshot = await getDocs(q);
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    data.sort((a, b) => {
      let aValue, bValue;

      if (orderField === "chipText") {
        aValue = a.chips?.[0]?.text || null;
        bValue = b.chips?.[0]?.text || null;

        if (!aValue && bValue) return 1;
        if (aValue && !bValue) return -1;
        if (!aValue && !bValue) return 0;

        const aStr = aValue.toLowerCase();
        const bStr = bValue.toLowerCase();
        if (aStr < bStr) return orderDirection === "asc" ? -1 : 1;
        if (aStr > bStr) return orderDirection === "asc" ? 1 : -1;
        return 0;
      }

      aValue = a[orderField];
      bValue = b[orderField];

      if (orderField === "rating") {
        return (bValue || 0) - (aValue || 0);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue || "").toLowerCase();
      const bStr = String(bValue || "").toLowerCase();
      if (aStr < bStr) return orderDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return orderDirection === "asc" ? 1 : -1;
      return 0;
    });

    setCharacters(data);
  }

  useEffect(() => {
    if (grupo) fetchCharacters();
  }, [grupo, tagFilter, orderField, orderDirection]);

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
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          columnCount: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
          },
          columnGap: 16,
        }}
      >
        {characters.map((char) => (
          <Box key={char.id} sx={{ breakInside: "avoid", mb: 3 }}>
            <CharacterCard
              character={char}
              onEdit={onEdit}
              {...(allowDelete && {
                onDelete: () => handleDeleteClick(char.id),
              })}
              showOG={showOG} // Aquí pasamos el prop showOG
            />
          </Box>
        ))}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este personaje? Esta acción no
            se puede deshacer.
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
