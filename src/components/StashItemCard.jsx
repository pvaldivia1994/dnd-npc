import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  IconButton,
  Button,
  CardMedia,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export default function StashItemCard({ item, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ width: "100%", my: 1 }}>
      <CardContent onClick={() => setExpanded(!expanded)} sx={{ cursor: "pointer" }}>
        <Typography variant="h6">{item.name}</Typography>
      </CardContent>

      <Collapse in={expanded}>
        <CardContent>
          {item.image && (
            <CardMedia
              component="img"
              image={item.image}
              alt={item.name}
              sx={{ maxHeight: 200, objectFit: "contain", mb: 2 }}
            />
          )}
          <Box
            sx={{
              typography: "body2",
              color: "text.secondary",
            }}
            dangerouslySetInnerHTML={{ __html: item.description || "Sin descripción." }}
          />
        </CardContent>

        <CardActions>
          {onEdit && (
            <Button size="small" onClick={() => onEdit(item)}>
              Editar
            </Button>
          )}
          {onDelete && (
            <Button color="error" size="small" onClick={() => onDelete(item.id)}>
              Eliminar
            </Button>
          )}
        </CardActions>
      </Collapse>
    </Card>
  );
}