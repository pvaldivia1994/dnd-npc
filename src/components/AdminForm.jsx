import {
  TextField,
  Button,
  Box,
  Typography,
  Rating,
  Paper
} from "@mui/material";
import { useState, useEffect } from "react";
import { db, uploadToImgBB } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export default function AdminForm({ characterToEdit, onSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name);
      setDescription(characterToEdit.description);
      setImageURL(characterToEdit.image);
      setRating(characterToEdit.rating);
    } else {
      setName("");
      setDescription("");
      setImageFile(null);
      setImageURL("");
      setRating(3);
    }
  }, [characterToEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let finalImageURL = imageURL;

    if (imageFile) {
      try {
        finalImageURL = await uploadToImgBB(imageFile);
      } catch (err) {
        alert("Error subiendo imagen");
        setLoading(false);
        return;
      }
    }

    const data = {
      name,
      description,
      image: finalImageURL,
      rating,
    };

    if (characterToEdit) {
      await updateDoc(doc(db, "characters", characterToEdit.id), data);
    } else {
      await addDoc(collection(db, "characters"), data);
    }

    // Reset
    setName("");
    setDescription("");
    setImageFile(null);
    setImageURL("");
    setRating(3);
    setLoading(false);

    onSaved && onSaved();
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {characterToEdit ? "Editar Personaje" : "Agregar Personaje"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField
          label="Descripción"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button variant="outlined" component="label">
          {imageFile ? imageFile.name : "Seleccionar imagen"}
          <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </Button>
        <Box>
          <Typography>Rating:</Typography>
          <Rating value={rating} onChange={(e, val) => setRating(val)} />
        </Box>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Guardando..." : characterToEdit ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Paper>
  );
}