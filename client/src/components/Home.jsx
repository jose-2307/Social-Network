import { useEffect, useState } from "react";
import { createLikeBack, getPostsBack, removeLikeBack } from "../services/posts.service";
import Loader from "./Loader";
import "./styles/Home.css";
import { Autocomplete, Backdrop, Button, Fade, Modal, TextField } from "@mui/material";
import { createFollow, getTagsBack, getUsersBack, updateTagBack } from "../services/user.service";

import { getFriendsBack } from "../services/user.service";

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
import { Link } from "react-router-dom";

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
    const [open2, setOpen2] = useState(false); //Controla el abrir y cerrar del modal
    const [tags, setTags] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isCommunity, setIsCommunity] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [open, setOpen] = React.useState(true);
    const [selectedUser,setSelectedUser] = useState("");
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
                const Friends = await getFriendsBack();
                setFriends(Friends);
                const resp = allUsers.map(x => {
                    return {label: x.name, id: x._id, isCommunity: x.isCommunity};
                });
                setUsers(resp);
                const allTags = await getTagsBack();
                setTags(allTags);
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

    const getCommunityPosts = async () => {
        setIsCommunity(!isCommunity);
        setLoading(true);
        let errorOCurred = false;
        try {
            const data = await getPostsBack(true);
            setCommunityPosts(data);
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

    const changeTagStatus = async (id) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            await updateTagBack(id);
            setTags(prevTags => {
                const newTags = prevTags.map(tag => {
                if (tag._id === id) {
                    return { ...tag, visualized: true };
                }
                return tag;
                });
                return newTags;
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

    const handleSearch = async (selectedUser) =>{
        setErrorMessage("");
        setSuccessMessage("");
        if (!selectedUser) {
            console.log(selectedUser);
        }
        console.log(selectedUser.id);
        // Verificar si el usuario seleccionado ya está en la lista de follows
        const userAlreadyFollowed = friends.some(
          (followedUser) => followedUser._id == selectedUser.id
        );
        
        console.log(friends);
        console.log(userAlreadyFollowed);

        if(userAlreadyFollowed){
            console.log("Ya sigues a este perfil");
            alert("Ya sigues a este perfil");
            return;
        }

        try {
            await createFollow(selectedUser.id);
            if (selectedUser.isCommunity){
                console.log("Comunidad seguida exitosamente");
                alert("Comunidad seguida exitosamente");
            }
            else{
                console.log("Usuario seguido exitosamente");
                alert("Usuario seguido exitosamente");
            }
          } catch (error) {
            alert("Error al seguir al usuario. Intente nuevamente");
          }
    };

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
                Red social
                </Typography>
                <IconButton color="inherit">
                    <Badge 
                    badgeContent={tags.length ? tags.length : null}
                    color="secondary">
                        <NotificationsIcon onClick={() => {setOpen2(true)}}/>
                        {open2 && ( 
                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                open={open} 
                                onClose={() => {setOpen2(false)}}
                                closeAfterTransition
                                slots={{ backdrop: Backdrop }}
                                slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                                }}
                            >
                                <Fade in={open}>
                                    <Box sx={{
                                        position: "absolute",
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 400,
                                        bgcolor: 'background.paper',
                                        border: '2px solid #000',
                                        boxShadow: 24,
                                        p: 4,}}
                                    >
                                        <Typography id="transition-modal-title" variant="h6" component="h2">
                                            Notificaciones
                                        </Typography>
                                        { tags.length === 0
                                            ? (
                                                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                                    No hay etiquetas
                                                </Typography>
                                            )
                                            : (
                                                tags.map(t => (
                                                    (!t.visualized 
                                                        ? (
                                                        <Typography id="transition-modal-description" sx={{ mt: 2 }} key={t._id}>
                                                            <Link style={{color: "rgba(0, 0, 0, 0.54)"}}to={`/${t.comment.postId}/comments`} onClick={() => changeTagStatus(t._id)}>
                                                                {t.name} te etiquitó en un comentario
                                                            </Link>
                                                        </Typography>
                                                        )
                                                        : (
                                                            <Typography id="transition-modal-description" sx={{ mt: 2 }} key={t._id}>
                                                                {t.name} te etiquitó en un comentario
                                                            </Typography>
                                                        )
                                                    )
                                                ))
                                            )
                                        }
                                        <br></br>
                                    </Box>
                                </Fade>
                            </Modal>
                        )}
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
                        value={selectedUser}
                        onChange={(event, newValue) => setSelectedUser(newValue)}                 
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="User" />}
                    />
                    <Button style={{ paddingLeft: "20px" }} onClick={() => handleSearch(selectedUser)}>Buscar</Button>
                </section>
                <Button onClick={() => getCommunityPosts()}>Switch feed</Button>
                {!isCommunity 
                    ? (
                        <>
                        <h1>Feed usuarios</h1>
                        <div className="container-all">
                            <div className="container-posts">
                                {usersPosts.length === 0 
                                    ?   <h3>No hay posts</h3>
                                    :   (
                                        usersPosts.map(p => (
                                            p.image 
                                                ? (
                                                    <>
                                                    <PostCard key={p._id} image={p.image} title={p.title} description={p.description} likes={p.likes} comments={p.comments} author={p.user} giveLike={giveLike} id={p._id}/>
                                                    <br key={`${p._id}<dsd`}></br>
                                                    </>
                                                )
                                                : (
                                                    <>
                                                    <PostCard key={p._id} title={p.title} description={p.description} likes={p.likes} comments={p.comments} author={p.user} giveLike={giveLike} id={p._id}/>
                                                    <br key={`${p._id}<dsddf`}></br>
                                                    </>
                                                )
                                        ))
                                    )
                                }
                            </div>
                        </div>
                        </>
                    ) 
                    : (
                        <>
                        <h1>Feed comunidades</h1>
                        <div className="container-all">
                            <div className="container-posts">
                                {communityPosts.length === 0 
                                    ?   <h3>No hay posts</h3>
                                    :   (
                                        communityPosts.map(p => (
                                            p.image 
                                                ? <PostCard key={p._id} image={p.image} title={p.title} description={p.description} likes={p.likes} comments={p.comments} author={p.user} giveLike={giveLike} id={p._id}/>
                                                : <PostCard key={p._id} title={p.title} description={p.description} likes={p.likes} comments={p.comments} author={p.user} giveLike={giveLike} id={p._id}/>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                        </>
                    )
                }
                
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            </div>
            </Container>
            </Box>
        </Box>
        </ThemeProvider>
    );

}

export default Home;