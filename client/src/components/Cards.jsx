import React from "react";
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia } from "@mui/material";

export default function MyCard({ size }) {
  return (
    <Card
      sx={{
        transition: "0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
       maxWidth:300
       
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
          <h2>Camilo Clift</h2>
          <p>Soy informático, me gusta jugar Valorant</p>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button variant="contained" color='success'>Agregar</Button>
        
      </CardActions>
    </Card>
  );
}
