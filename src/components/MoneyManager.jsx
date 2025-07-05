import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Iconos por tipo de moneda (puedes reemplazar los emojis con imágenes)
const coinMeta = {
  pp: {
    label: "Platinum",
    alias: "PP",
    emoji: "🏆",
    image: "", // URL personalizada si quieres usar imagen
    color: "#9e9e9e"
  },
  gp: {
    label: "Gold",
    alias: "GP",
    emoji: "💰",
    image: "",
    color: "#fbc02d"
  },
  sp: {
    label: "Silver",
    alias: "SP",
    emoji: "🥈",
    image: "",
    color: "#b0bec5"
  },
  cp: {
    label: "Copper",
    alias: "CP",
    emoji: "🪙",
    image: "",
    color: "#8d6e63"
  }
};

const defaultMoney = { pp: 0, gp: 0, sp: 0, cp: 0 };

export default function MoneyManager({ grupo = "grupo1" }) {
  const [money, setMoney] = useState(defaultMoney);
  const [adjust, setAdjust] = useState(defaultMoney);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function fetchMoney() {
      const ref = doc(db, "money", grupo);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const fixedData = { ...defaultMoney, ...data };
        setMoney(fixedData);
      } else {
        await setDoc(ref, defaultMoney);
        setMoney(defaultMoney);
      }
    }
    fetchMoney();
  }, [grupo]);

  const saveMoney = async (newMoney) => {
    await setDoc(doc(db, "money", grupo), newMoney);
    setMoney(newMoney);
  };

  const getTotalInGP = (m) => {
    const safe = (n) => Number.isFinite(n) ? n : 0;
    return (
      safe(m.pp) * 10 +
      safe(m.gp) +
      safe(m.sp) / 10 +
      safe(m.cp) / 100
    );
  };

  const handleChange = (type, value) => {
    const val = parseInt(value) || 0;
    setAdjust({ ...adjust, [type]: val });
  };

  const handleAdd = () => {
    const newMoney = {};
    for (const key in coinMeta) {
      newMoney[key] = (money[key] || 0) + (adjust[key] || 0);
    }
    saveMoney(newMoney);
    setAdjust(defaultMoney);
  };

  const handleRemove = () => {
    const newMoney = {};
    for (const key in coinMeta) {
      newMoney[key] = (money[key] || 0) - (adjust[key] || 0);
    }
    saveMoney(newMoney);
    setAdjust(defaultMoney);
  };

  // Nuevo handler para abrir el diálogo de confirmación
  const handleClearConfirm = () => {
    setConfirmOpen(true);
  };

  // Ejecutar limpiar y cerrar diálogo
  const handleClear = () => {
    saveMoney(defaultMoney);
    setAdjust(defaultMoney);
    setConfirmOpen(false);
  };

  // Cancelar limpiar y cerrar diálogo
  const handleCancelClear = () => {
    setConfirmOpen(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ background: "#f7f7f7", p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Total en GP: {getTotalInGP(money).toFixed(2)}
        </Typography>

        <Grid container spacing={1}>
          {Object.entries(coinMeta).map(([key, meta]) => (
            <Grid item xs={6} sm={4} md={2} key={key}>
              <Chip
                avatar={
                  meta.image ? (
                    <Avatar src={meta.image} />
                  ) : (
                    <Avatar>{meta.emoji}</Avatar>
                  )
                }
                label={`${meta.label}: ${money[key] || 0}`}
                sx={{
                  backgroundColor: meta.color,
                  color: "#000",
                  width: "100%",
                  fontWeight: "bold"
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1">Ajustar Monedas</Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1
          }}
        >
          {Object.entries(coinMeta).map(([key, meta]) => (
            <Grid item xs={12} sm={4} md={2} key={key}>
              <TextField
                type="number"
                size="small"
                fullWidth
                label={`${meta.label} - (${meta.alias})`}
                value={adjust[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </Grid>
          ))}
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1
          }}
        >
          <Button variant="contained" color="success" onClick={handleAdd} fullWidth>
            + Agregar
          </Button>
          <Button variant="contained" color="warning" onClick={handleRemove} fullWidth>
            - Remover
          </Button>
          <Button variant="outlined" color="error" onClick={handleClearConfirm} fullWidth>
            Limpiar Todo
          </Button>
        </Box>

        {/* Dialogo de confirmacion */}
        <Dialog open={confirmOpen} onClose={handleCancelClear}>
          <DialogTitle>Confirmar Limpieza</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que quieres limpiar todas las monedas? Esto pondrá todas las monedas a cero.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelClear}>Cancelar</Button>
            <Button color="error" onClick={handleClear} autoFocus>
              Limpiar Todo
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
