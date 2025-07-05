import { useState, useEffect } from "react";
import {
  Box, Typography, List, TextField, Button, Modal, Divider
} from "@mui/material";
import { db } from "../firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp
} from "firebase/firestore";
import StashItemCard from "./StashItemCard";

export default function StashManager({ grupo }) {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState([]);
  const [stash, setStash] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [customItem, setCustomItem] = useState({ name: "", description: "", image: "" });

  useEffect(() => {
    if (grupo) fetchStash();
  }, [grupo]);

  async function fetchStash() {
    // Filtrar firestore por grupo
    const q = query(collection(db, "stash"), where("grupo", "==", grupo));
    const snap = await getDocs(q);
    setStash(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  async function searchItems() {
    if (!queryText) 
    {
        setResults([]);
        return;
    }
    
    const res = await fetch("https://www.dnd5eapi.co/api/equipment");
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.name.toLowerCase().includes(queryText.toLowerCase())
    );

    const details = await Promise.all(filtered.slice(0, 5).map(async item => {
      const resDetail = await fetch(`https://www.dnd5eapi.co${item.url}`);
      const detail = await resDetail.json();
      return {
        name: detail.name,
        description: (detail.desc || []).join("<br>"),
        image: "", // no tiene imagen la API
        type: "equipment"
      };
    }));

    setResults(details);
  }

  async function addToStash(item) {
    if (!grupo) {
      alert("No hay grupo definido");
      return;
    }

    if (editingItem) {
      await updateDoc(doc(db, "stash", editingItem.id), {
        ...item,
        grupo,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "stash"), {
        ...item,
        grupo,
        createdAt: serverTimestamp(),
      });
    }
    fetchStash();
    setEditingItem(null);
    setCustomItem({ name: "", description: "", image: "" });
    setModalOpen(false);
  }

  async function removeFromStash(id) {
    await deleteDoc(doc(db, "stash", id));
    fetchStash();
  }

  function handleEdit(item) {
    setEditingItem(item);
    setCustomItem(item);
    setModalOpen(true);
  }

  function handleCustomCreate() {
    setEditingItem(null);
    setCustomItem({ name: "", description: "", image: "" });
    setModalOpen(true);
  }

  return (
    <Box sx={{ mt: 2 }}>
        <Box
        sx={{
            display: "flex",
            gap: 1,
            mb: 2,
            flexDirection: {
            xs: "column",  // en celular (xs) los hijos se apilan verticalmente
            sm: "row",     // en sm+ los hijos van en fila (horizontal)
            },
            alignItems: {
            xs: "stretch",  // para que el botón ocupe todo el ancho en vertical
            sm: "center",
            },
        }}
        >
        <TextField
            label="Buscar ítem (D&D 5e)"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            size="small"
            onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchItems();
            }
            }}
        />
        <Button variant="contained" onClick={searchItems}>
            Buscar
        </Button>
        <Button variant="outlined" onClick={handleCustomCreate}>
            + Personalizado
        </Button>
        </Box>


      {results.map((item, idx) => (
        <StashItemCard
          key={`res-${idx}`}
          item={item}
          onDelete={null}
          onEdit={() => {
            setCustomItem(item);
            setEditingItem(null);
            setModalOpen(true);
          }}
        />
      ))}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Items Guardados</Typography>
      {stash.map(item => (
        <StashItemCard
          key={item.id}
          item={item}
          onEdit={handleEdit}
          onDelete={removeFromStash}
        />
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}>
          <Typography variant="h6" gutterBottom>
            {editingItem ? "Editar ítem" : "Nuevo ítem"}
          </Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={customItem.name}
            onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descripción (HTML)"
            multiline
            rows={4}
            fullWidth
            value={customItem.description}
            onChange={(e) => setCustomItem({ ...customItem, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="URL de imagen"
            fullWidth
            value={customItem.image}
            onChange={(e) => setCustomItem({ ...customItem, image: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={() => addToStash(customItem)}>
            {editingItem ? "Guardar Cambios" : "Agregar"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
