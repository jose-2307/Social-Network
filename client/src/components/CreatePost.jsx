import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useState } from "react";
import Loader from "./Loader";
import { createPostBack } from "../services/posts.service";



const validate = (values) => {
    const errors = {};

    if (!values.title) {
        errors.title = "Requerido";
    } else if (values.title.length > 12) {
        errors.title = "El nombre debe tener a lo más 12 caracteres";
    }

    if (!values.description) {
        errors.description = "Requerido";
    }


    return errors;
}


const CreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            await createPostBack({title: values.title, description: values.description});        
            navigate(-1); //Para volver a la página anterior
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
            errorOCurred = true;
        } finally {
            if (!errorOCurred) {
                setLoading(false);
            }
        }
    }

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    return (
        <>          
            <div style={{display: "grid", placeItems: "center"}}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Crear nuevo post
                        </Typography>
                        <Formik 
                            initialValues={{title: "", description: ""}} 
                            validate={validate} 
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <TextInput name="title" label="Titulo" adornment=" " type="text"  />
                                <TextInput name="description" label="Descripción" adornment=" "  type="text" />
                                <br/>
                                <br/>
                                <Button type="submit" variant="outlined" 
                                    >Guardar
                                </Button>
                            </Form>
                        </Formik>
                    </CardContent> 
                </Card>
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            </div>
        </>
    )
}

export default CreatePost;

