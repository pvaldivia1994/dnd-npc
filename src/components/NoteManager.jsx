import {
  Box,
  Typography,
  Button,
  Modal,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function NoteManager({ grupo }) {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: "", description: "", image: "" });
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  useEffect(() => {
    if (grupo) fetchNotes();
  }, [grupo]);

  async function fetchNotes() {
    const q = query(collection(db, "notes"), where("grupo", "==", grupo));
    const snap = await getDocs(q);
    setNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  function openNewNote() {
    setEditingNote(null);
    setNoteForm({ title: "", description: "", image: "" });
    setModalOpen(true);
  }

  function handleEdit(note) {
    setEditingNote(note);
    setNoteForm(note);
    setModalOpen(true);
  }

  async function handleSaveNote() {
    if (editingNote) {
      await updateDoc(doc(db, "notes", editingNote.id), {
        ...noteForm,
        grupo,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "notes"), {
        ...noteForm,
        grupo,
        createdAt: serverTimestamp(),
      });
    }

    fetchNotes();
    setEditingNote(null);
    setNoteForm({ title: "", description: "", image: "" });
    setModalOpen(false);
  }

  function confirmDelete(id) {
    setSelectedToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedToDelete) return;
    await deleteDoc(doc(db, "notes", selectedToDelete));
    setDeleteDialogOpen(false);
    setSelectedToDelete(null);
    fetchNotes();
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false);
    setSelectedToDelete(null);
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
        }}
      >
        <Button variant="outlined" onClick={openNewNote}>
          + Nueva Nota
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6">Notas Guardadas</Typography>
      {notes.map(note => (
        <Card key={note.id} sx={{ width: "100%", my: 1 }}>
          <CardContent
            onClick={() =>
              setExpandedNoteId(expandedNoteId === note.id ? null : note.id)
            }
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6">{note.title}</Typography>
          </CardContent>

          <Collapse in={expandedNoteId === note.id}>
            <CardContent>
              {note.image && (
                <CardMedia
                  component="img"
                  image={note.image}
                  alt={note.title}
                  sx={{ maxHeight: 200, objectFit: "contain", mb: 2 }}
                />
              )}
              <Box
                sx={{ typography: "body2", color: "text.secondary" }}
                dangerouslySetInnerHTML={{
                  __html: note.description || "Sin descripción.",
                }}
              />
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEdit(note)}>
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => confirmDelete(note.id)}
              >
                Eliminar
              </Button>
            </CardActions>
          </Collapse>
        </Card>
      ))}

      {/* Modal de Crear/Editar Nota */}
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
          <Typography variant="h6" gutterBottom>
            {editingNote ? "Editar Nota" : "Nueva Nota"}
          </Typography>
          <TextField
            label="Título"
            fullWidth
            value={noteForm.title}
            onChange={(e) =>
              setNoteForm({ ...noteForm, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="URL de imagen"
            fullWidth
            value={noteForm.image}
            onChange={(e) =>
              setNoteForm({ ...noteForm, image: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Descripción
            </Typography>
            <ReactQuill
              theme="snow"
              value={noteForm.description}
              onChange={(value) =>
                setNoteForm({ ...noteForm, description: value })
              }
              style={{  backgroundColor: "#fff" }}
            />
          </Box>
          <Button variant="contained" onClick={handleSaveNote}>
            {editingNote ? "Guardar Cambios" : "Agregar"}
          </Button>
        </Box>
      </Modal>

      {/* Dialogo de Confirmación para Eliminar */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar esta nota? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
