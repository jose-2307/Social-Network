import React from "react";
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia } from "@mui/material";
import { createFollow } from "../services/user.service";

export default function MyCard({ name , id }) {

  const handleFollowClick = async () => {
    try {
      await createFollow(id);
      console.log(`Usuario ${name} seguido exitosamente.`);
      window.location.reload();
    } catch (error) {
      console.log("Error siguiendo al usuario:", error);
    }
  };

  return (
    <Card
      sx={{
        transition: "0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image="https://picsum.photos/200/300"
          height="200"
          alt="Card Image"
        /> 
        <CardContent>
          <h2>{name}</h2>
          <p>¡Tienes un amigo en común con {name}! ¿Te gustaría agregarlo?</p>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button variant="contained" color="success" onClick={handleFollowClick}>
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
}
