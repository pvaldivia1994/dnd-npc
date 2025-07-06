import React, { useState, useEffect } from "react";
import AdminForm from "../components/AdminForm";
import CharacterList from "../components/CharacterList";
import StashManager from "../components/StashManager";
import MoneyManager from "../components/MoneyManager";
import NoteManager from "../components/NoteManager";

import {
  Button,
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
  const [tagFilter, setTagFilter] = useState("todos");
  const [orderField, setOrderField] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");

  const savedTab = localStorage.getItem(`tabIndex-${grupo}`);
  const [tabIndex, setTabIndex] = useState(savedTab ? parseInt(savedTab) : 0);

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

  const grupoNombre =
    grupo === "grupo1"
      ? "Grupo 1 - Sobrevivientes"
      : grupo === "grupo2"
      ? "Grupo A - Los Protas"
      : "Grupo desconocido";

  useEffect(() => {
    localStorage.setItem(`tabIndex-${grupo}`, tabIndex);
  }, [tabIndex, grupo]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {grupoNombre}
      </Typography>
      <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)}>
        <Tab label="NPC" />
        <Tab label="Stash" />
        <Tab label="Money" />
        <Tab label="Notas" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        {/* Filtro + Orden + Botón */}
        <Grid container spacing={1} sx={{ mt: 2, mb: 2 }} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="tag-filter-label">Filtrar por Tag</InputLabel>
              <Select
                labelId="tag-filter-label"
                value={tagFilter}
                label="Filtrar por Tag"
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="#npc">#npc</MenuItem>
                <MenuItem value="#tripulante">#tripulante</MenuItem>
                <MenuItem value="#pet">#pet</MenuItem>
                <MenuItem value="#otros">#otros</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="order-field-label">Ordenar por</InputLabel>
              <Select
                labelId="order-field-label"
                value={orderField}
                label="Ordenar por"
                onChange={(e) => setOrderField(e.target.value)}
              >
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="rating">Cariño</MenuItem>
                <MenuItem value="chipText">Chip</MenuItem>
                
              </Select>
            </FormControl>
          </Grid>
          {/*
          <Grid item xs={6} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="order-direction-label">Dirección</InputLabel>
              <Select
                labelId="order-direction-label"
                value={orderDirection}
                label="Dirección"
                onChange={(e) => setOrderDirection(e.target.value)}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
         */}

          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleNew}
              sx={{ height: "100%" }}
            >
              Agregar NPC
            </Button>
          </Grid>
        </Grid>

        {/* Modal para el formulario */}
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
          tagFilter={tagFilter}
          orderField={orderField}
          orderDirection={orderDirection}
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <StashManager grupo={grupo} />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <MoneyManager grupo={grupo} />
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <NoteManager grupo={grupo} />
      </TabPanel>
    </div>
  );
}
