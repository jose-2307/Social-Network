import { useEffect, useState } from "react";
import { createLikeBack, getPostsBack, removeLikeBack } from "../services/posts.service";
import Loader from "./Loader";
import "./styles/Home.css";
import { Autocomplete, Button, TextField } from "@mui/material";
import { getUsersBack } from "../services/user.service";

import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import PostCard from "./PostCard";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();



const Home = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [usersPosts, setUsersPosts] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [users, setUsers] = useState([]);
    
    
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
      setOpen(!open);
    };


    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchFeedUsers = async () => {
            try {
                const data = await getPostsBack();
                setUsersPosts(data);
                const allUsers = await getUsersBack();
                const resp = allUsers.map(x => {
                    return {label: x.name, id: x._id, isCommunity: x.isCommunity};
                });
                setUsers(resp);
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
        fetchFeedUsers();     
    }, []);

    const giveLike = async (postId) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            await createLikeBack(postId);
            setUsersPosts(prevUsersPosts => {
                const newUsersPosts = prevUsersPosts.map(post => {
                  if (post._id === postId) {
                    return { ...post, likes: post.likes + 1 };
                  }
                  return post;
                });
                return newUsersPosts;
              });
        } catch (error) {
            console.log(error.message);
            if (error.message == "El like ya existe.") {
                await removeLike(postId);
            } else {
                setErrorMessage(error.message);
                errorOCurred = true;
            }
        } finally {
            if (!errorOCurred) {
                setLoading(false);
            }
        }
    }

    const removeLike = async (postId) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            await removeLikeBack(postId);
            setUsersPosts(prevUsersPosts => {
                const newUsersPosts = prevUsersPosts.map(post => {
                  if (post._id === postId) {
                    return { ...post, likes: post.likes - 1 };
                  }
                  return post;
                });
                return newUsersPosts;
            });
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
console.log(usersPosts)
    return (
        <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
            <Toolbar
                sx={{
                pr: '24px', // keep right padding when drawer closed
                }}
            >
                <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                }}
                >
                <MenuIcon />
                </IconButton>
                <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
                >
                Dashboardaa
                </Typography>
                <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon />
                </Badge>
                </IconButton>
            </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
                }}
            >
                <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                {mainListItems}
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
            </List>
            </Drawer>
            <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
            >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <section style={{ display: "flex", flexDirection: "row", paddingTop: "20px" }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={users}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="User" />}
                    />
                    <Button style={{ paddingLeft: "20px" }}>Buscar</Button>
                </section>
                
                <h1>Feed usuarios</h1>
                <div className="container-all">
                    <div className="container-posts">
                        {usersPosts.length === 0 
                            ?   <h3>No hay posts</h3>
                            :   (
                                usersPosts.map(p => (
                                    p.image 
                                        ? <PostCard key={p._id} image={p.image} title={p.title} description={p.description} likes={p.likes} comments={p.comments} author={p.user} giveLike={giveLike} id={p._id}/>
                                        : <PostCard key={p._id} title={p.title} description={p.description} likes={p.likes} comments={p.comments} author={p.user} giveLike={giveLike} id={p._id}/>
                                ))
                            )
                        }
                    </div>
                </div>
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            </div>
            </Container>
            </Box>
        </Box>
        </ThemeProvider>
    );

}

export default Home;