import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, Box, Button, CssBaseline, Grid, Typography, Container, TextField } from "@mui/material";
import { useState } from "react";
import { Formik, Form } from "formik";
import Loader from "./Loader";
import Cookies from "universal-cookie";
import { loginBack } from "../services/auth.service";



const defaultTheme = createTheme();
const validate = (values) => {
    const errors = {};

    if (values.password.length < 8 || values.password.length > 12) {
        errors.password = "La contraseña debe tener entre 8 y 12 caracteres.";
    }
    return errors;
}

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const login = await loginBack({email: values.email, password: values.password});
            //cookies
            const cookies = new Cookies();
            cookies.set("accessToken", login.accessToken, { path: "/" });
            cookies.set("refreshToken", login.refreshToken, { path: "/" });
            
            setLoading(false);
            navigate("/");
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
        <ThemeProvider theme={defaultTheme}>
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
                <Formik  
                    initialValues={{email: "", password: ""}} 
                    validate={validate} 
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Form>
                </Formik>
                
                <Grid container>
                    <Grid item xs>
                    <Link href="#" variant="body2">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item>
                    <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                    </Grid>
                </Grid>
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}

                </Box>
            </Container>
        </ThemeProvider>
    );
    
}

export default Login;