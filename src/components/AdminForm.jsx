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
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { db, uploadToImgBB } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminForm({ characterToEdit, onSaved, onCancel, grupo }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFile_2, setImageFile_2] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [imageURL_2, setImageURL_2] = useState("");
  const [rating, setRating] = useState(3);
  const [tag, setTag] = useState("#npc");
  const [loading, setLoading] = useState(false);
  const [urlEditable, setUrlEditable] = useState(false);
  const [chips, setChips] = useState([]);

  const chipColors = ["default","primary","secondary","error","warning","info","success"];

  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name || "");
      setDescription(characterToEdit.description || "");
      setImageURL(characterToEdit.image || "");
      setImageURL_2(characterToEdit.image_2 || "");
      setRating(characterToEdit.rating || 3);
      setTag(characterToEdit.tag || "#npc");
      setChips(characterToEdit.chips || []);
    } else {
      setName("");
      setDescription("");
      setImageFile(null);
      setImageFile_2(null);
      setImageURL("");
      setImageURL_2("");
      setRating(3);
      setTag("#npc");
      setChips([]);
    }
  }, [characterToEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!name.trim()) {
      alert("El nombre es obligatorio");
      setLoading(false);
      return;
    }
    if (!description || description === "<p><br></p>") {
      alert("La descripción es obligatoria");
      setLoading(false);
      return;
    }

    let finalImageURL = imageURL;
    let finalImageURL2 = imageURL_2;

    // Subir primera imagen si hay archivo nuevo
    if (imageFile) {
      try {
        finalImageURL = await uploadToImgBB(imageFile);
      } catch {
        alert("Error subiendo la imagen OG");
        setLoading(false);
        return;
      }
    }
    // Subir segunda imagen
    if (imageFile_2) {
      try {
        finalImageURL2 = await uploadToImgBB(imageFile_2);
      } catch {
        alert("Error subiendo la imagen RotSS");
        setLoading(false);
        return;
      }
    }

    const data = {
      name,
      description,
      image: finalImageURL,
      image_2: finalImageURL2,
      rating,
      grupo,
      tag,
      chips
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
    setImageFile_2(null);
    setImageURL("");
    setImageURL_2("");
    setRating(3);
    setTag("#npc");
    setChips([]);
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
        {/* Nombre */}
        <TextField label="Nombre" value={name} onChange={e=>setName(e.target.value)} required />

        {/* Descripción */}
        <Box>
          <Typography variant="body2" gutterBottom>Descripción</Typography>
          <ReactQuill theme="snow" value={description} onChange={setDescription} style={{backgroundColor:"#fff"}}/>
        </Box>

        {/* File inputs */}
        <Box sx={{ display:"flex", gap:1, flexWrap:"wrap" }}>
          <Button variant="outlined" component="label">
            {imageFile ? imageFile.name : (imageURL ? "ACTUALIZAR (OG)" : "CARGAR (OG)")}
            <input type="file" hidden accept="image/*" onChange={e=>setImageFile(e.target.files[0])}/>
          </Button>
          <Button variant="outlined" component="label">
            {imageFile_2 ? imageFile_2.name : (imageURL_2 ? "ACTUALIZAR (RotSS)" : "CARGAR (RotSS)")}
            <input type="file" hidden accept="image/*" onChange={e=>setImageFile_2(e.target.files[0])}/>
          </Button>
          <FormControlLabel
            control={<Switch checked={urlEditable} onChange={()=>setUrlEditable(!urlEditable)} color="primary"/>}
            label="Editar URLs"
          />
        </Box>

        {/* URL fields, solo si urlEditable */}
        {urlEditable && (
          <Box sx={{ display:"flex", gap:1, flexDirection:{ xs:"column", sm:"row"} }}>
            <TextField
              label="URL OG"
              fullWidth
              value={imageURL}
              onChange={e=>setImageURL(e.target.value)}
            />
            <TextField
              label="URL (RotSS)"
              fullWidth
              value={imageURL_2}
              onChange={e=>setImageURL_2(e.target.value)}
            />
          </Box>
        )}

        {/* Tag */}
        <FormControl fullWidth>
          <InputLabel id="tag-label">Tag</InputLabel>
          <Select labelId="tag-label" value={tag} label="Tag" onChange={e=>setTag(e.target.value)}>
            <MenuItem value="#npc">#npc</MenuItem>
            <MenuItem value="#tripulante">#tripulante</MenuItem>
            <MenuItem value="#pet">#pet</MenuItem>
            <MenuItem value="#rip">#rip</MenuItem>
            <MenuItem value="#otros">#otros</MenuItem>
          </Select>
        </FormControl>

        {/* Rating */}
        <Box>
          <Typography>Cariño:</Typography>
          <Rating
            value={rating}
            onChange={(e,val)=>setRating(val)}
            icon={<FavoriteIcon fontSize="inherit" color="error"/>}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit"/>}
          />
        </Box>

        {/* Chips */}
        <Box>
          <Typography variant="body2" sx={{mb:1}}>Chips</Typography>
          {chips.map((chip,i)=>(
            <Box key={i} sx={{display:"flex",gap:1,mb:1}}>
              <TextField
                label={`Texto Chip ${i+1}`}
                value={chip.text}
                onChange={e=>{
                  const arr=[...chips]; arr[i].text=e.target.value; setChips(arr);
                }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={chip.color}
                  label="Color"
                  onChange={e=>{
                    const arr=[...chips]; arr[i].color=e.target.value; setChips(arr);
                  }}
                >
                  {chipColors.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem> )}
                </Select>
              </FormControl>
              <Button color="error" onClick={()=>{
                setChips(chips.filter((_,j)=>j!==i));
              }}>
                <DeleteIcon/>
              </Button>
            </Box>
          ))}
          {chips.length<3 && (
            <Button variant="outlined" onClick={()=>setChips([...chips,{text:"",color:"default"}])}>
              + Agregar Chip
            </Button>
          )}
        </Box>

        {/* Acciones */}
        <Box sx={{display:"flex",gap:2,justifyContent:"flex-end"}}>
          <Button onClick={onCancel} variant="outlined" color="secondary" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Guardando..." : characterToEdit ? "Actualizar" : "Guardar"}
          </Button>
        </Box>
      </Box>
    </div>
  );
}