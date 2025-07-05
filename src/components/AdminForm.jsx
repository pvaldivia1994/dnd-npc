import {
  TextField,
  Button,
  Box,
  Typography,
  Rating,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { useState, useEffect } from "react";
import { db, uploadToImgBB } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function AdminForm({ characterToEdit, onSaved, grupo }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [rating, setRating] = useState(3);
  const [tag, setTag] = useState("#npc");
  const [loading, setLoading] = useState(false);
  const [urlEditable, setUrlEditable] = useState(false);

  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name || "");
      setDescription(characterToEdit.description || "");
      setImageURL(characterToEdit.image || "");
      setRating(characterToEdit.rating || 3);
      setTag(characterToEdit.tag || "#npc");
    } else {
      setName("");
      setDescription("");
      setImageFile(null);
      setImageURL("");
      setRating(3);
      setTag("#npc");
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
      grupo,
      tag
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
    setTag("#npc");
    setLoading(false);

    onSaved && onSaved();
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {characterToEdit ? "Editar Personaje" : "Agregar Personaje"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            label="URL de la imagen"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Pega la URL de la imagen aquí"
            disabled={!urlEditable}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={urlEditable}
                onChange={() => setUrlEditable(!urlEditable)}
                color="primary"
              />
            }
            label="Editar"
            sx={{ whiteSpace: "nowrap" }}
          />
        </Box>

        <FormControl fullWidth>
          <InputLabel id="tag-label">Tag</InputLabel>
          <Select
            labelId="tag-label"
            value={tag}
            label="Tag"
            onChange={(e) => setTag(e.target.value)}
          >
            <MenuItem value="#npc">#npc</MenuItem>
            <MenuItem value="#tripulante">#tripulante</MenuItem>
            <MenuItem value="#otros">#otros</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography>Cariño:</Typography>
          <Rating
            value={rating}
            onChange={(e, val) => setRating(val)}
            icon={<FavoriteIcon fontSize="inherit" color="error" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : characterToEdit ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </div>
  );
}
