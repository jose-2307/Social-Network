import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { Formik,Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import TextInput from './TextInput';
import Loader from './Loader';
import { useState } from 'react';
import { singUpBack } from '../services/auth.service';


const validate = (values) => {
    const errors = {};

    const emailData = values.email.split(".");

    if (values.name.length < 3) {
        errors.name = "El nombre debe tener a lo menos 3 caracteres.";
    } else if (values.name.length > 15){
        errors.name = "El nombre debe tener a lo más 15 caracteres.";
    }


    if (emailData[emailData.length-1] != "cl" && emailData[emailData.length-1] != "com" && emailData[emailData.length-1] != "net") {
        errors.email = "Correo electrónico inválido.";
    }

    if (values.password.length < 8 || values.password.length > 12) {
        errors.password = "La contraseña debe tener entre 8 y 12 caracteres.";
    }
    return errors;
}

const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [community, setCommunity] = useState(false);


    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            values["isCommunity"] = community;
            const singUp = await singUpBack({name: values.name, lastName: values.lastName, email: values.email, password: values.password, isCommunity: values.isCommunity});
            console.log(singUp);
            navigate("/login");

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
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign in
            </Typography>
            <Formik  initialValues={{name: "", email: "", password: ""}} 
                validate={validate} 
                onSubmit={handleSubmit}
            >
                <Form>
                    <TextInput name="name" required label="Nombre" adornment=" " type="text" id="name" dimesions={{ m: 1, width: "66vh" }}></TextInput>
                    <br></br>
                    <TextInput name="email" required label="Correo electrónico" adornment=" " type="email" id="outlined-required" dimesions={{ m: 1, width: "66vh" }} placeholder="Ej: usuario@mail.com"></TextInput>
                    <br></br>
                    <TextInput name="password" required label="Contraseña" adornment=" " type="password" id="password" dimesions={{ m: 1, width: "66vh" }} autoComplete="current-password"></TextInput>
                    <input type="checkbox"  onChange={() => setCommunity(!community)}/> <span>Es comunidad</span>
                    <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Crear cuenta
                        </Button>
                    </div>
                </Form>
            </Formik>
            
            <Grid container>
                <Grid item>
                <Link to="/login" variant="body2">
                    ¿Ya tienes una cuenta? Inicia sesión
                </Link>
                </Grid>
            </Grid>
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}

            </Box>
        </Container>
    );
}

export default SignUp;