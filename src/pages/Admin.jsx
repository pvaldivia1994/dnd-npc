// Admin.jsx
import React, { useState } from "react";
import AdminForm from "../components/AdminForm";
import CharacterList from "../components/CharacterList";
import styles from "../styles/Admin.module.css";
import { Button, Modal, Box } from "@mui/material";

export default function Admin() {
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function handleEdit(character) {
    setEditingCharacter(character);
    setModalOpen(true);
  }

  function handleSaved() {
    setEditingCharacter(null);
    setModalOpen(false);
    setRefreshFlag(!refreshFlag);
  }

  function handleNew() {
    setEditingCharacter(null);
    setModalOpen(true);
  }

  return (
    <div className={styles.container}>
      <h1>Panel de Administración</h1>

      <Button variant="contained" onClick={handleNew} sx={{ mb: 2 }}>
        Agregar Personaje
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <AdminForm characterToEdit={editingCharacter} onSaved={handleSaved} />
        </Box>
      </Modal>

      <CharacterList key={refreshFlag} onEdit={handleEdit} allowDelete={true} />
    </div>
  );
}
