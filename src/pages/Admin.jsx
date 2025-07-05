import React, { useState } from "react";
import AdminForm from "../components/AdminForm";
import CharacterList from "../components/CharacterList";
import StashManager from "../components/StashManager";
import styles from "../styles/Admin.module.css";
import MoneyManager from "../components/MoneyManager";

import {
  Button,
  Modal,
  Box,
  Tabs,
  Tab,
  Typography
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Admin({ grupo }) {
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

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

  const grupoNombre = grupo === "grupo1"
    ? "Grupo 1 - Sobrevivientes"
    : grupo === "grupo2"
      ? "Grupo A - Los Protas"
      : "Grupo desconocido";


  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {grupoNombre}
      </Typography>
      <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)}>
        <Tab label="Personajes" />
        <Tab label="Stash" />
        <Tab label="Money" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Button variant="contained" onClick={handleNew} sx={{ mt: 2 }}>
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
            <AdminForm
              characterToEdit={editingCharacter}
              onSaved={handleSaved}
              grupo={grupo}
            />
          </Box>
        </Modal>

        <CharacterList
          key={refreshFlag}
          onEdit={handleEdit}
          allowDelete={true}
          grupo={grupo}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <StashManager grupo={grupo} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <MoneyManager grupo={grupo} />
      </TabPanel>
    </div>
  );
}
