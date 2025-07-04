import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Collapse,
  CardActionArea,
  Box,
  Button
} from "@mui/material";
import { useState } from "react";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function CharacterCard({ character, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card  sx={{width:{md:"250px", xs:"100%" } ,  margin: 1, boxShadow: 3 }}>
      <CardActionArea onClick={toggleExpand}>
        <CardContent>
            {character.image && (
          <CardMedia
            component="img"
            image={character.image}
            alt={character.name}
          />
        )}
          <Typography variant="h6" align="center">
            {character.name}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {character.description}
          </Typography>
          <Rating value={character.rating} readOnly  
                  icon={<FavoriteIcon fontSize="inherit" color="error" />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" />} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {onEdit && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => onEdit(character)} >
                Editar
              </Button>
            )}
           {onDelete && (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(character.id)} >
                    Eliminar
                </Button>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}