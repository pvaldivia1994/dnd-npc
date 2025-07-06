import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Collapse,
  CardActionArea,
  Box,
  Button,
  Chip
} from "@mui/material";
import { useState } from "react";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function CharacterCard({ character, onEdit, onDelete, showOG }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const imgSrc = showOG
    ? character.image
    : (character.image_2 || character.image);

  return (
    <Card sx={{ width: "100%", margin: 0, boxShadow: 3 }}>
      <CardActionArea onClick={toggleExpand}>
        <Box sx={{ position: "relative" }}>
          {/* Imagen */}
          {imgSrc && (
            <CardMedia
              component="img"
              image={imgSrc}
              alt={character.name}
              sx={{
                objectFit: "cover",
                width: "100%",
              }}
            />
          )}

          {/* Chips en la imagen */}
          <Box
            sx={{
              position: "absolute",
              bottom: -12,
              right: 8,
              display: "flex",
              gap: 1,
              zIndex: 1,
              flexWrap: "wrap",
              maxWidth: "calc(100% - 16px)",
            }}
          >
            {(character.chips || []).map((chip, index) => (
              <Chip
                key={index}
                label={chip.text}
                size="small"
                color={chip.color !== "default" ? chip.color : undefined}
                sx={chip.color === "default" ? { bgcolor: "#eee" } : {}}
              />
            ))}
          </Box>
        </Box>

        <CardContent sx={{ pt: 3 }}>
          <Typography variant="h6" align="center">
            {character.name}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
            component="div"
            dangerouslySetInnerHTML={{ __html: character.description || "" }}
          />

          <Rating
            value={character.rating}
            readOnly
            icon={<FavoriteIcon fontSize="inherit" color="error" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {onEdit && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => onEdit(character)}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onDelete(character.id)}
              >
                Eliminar
              </Button>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}
