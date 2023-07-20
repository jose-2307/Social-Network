import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getFriendsBack } from "../services/user.service";
import { Avatar, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const Friends = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchFeedUsers = async () => {
            try {
                const data = await getFriendsBack();
                setFriends(data);
                
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

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }
    return (
        <>
            <div className="container-all">
                <div className="container-posts">
                <h1>Mis amigos ({friends.length})</h1>

                    {friends.length === 0 
                        ?   <h3>No hay amigos</h3>
                        :   (
                            friends.map(p => (
                                <Card sx={{ width: 345 }}>
                                    <CardHeader
                                        avatar={
                                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                            {p.name[0]}
                                        </Avatar>
                                        }
                                        title={p.isCommunity ? `${p.name} (Comunidad)`  : `${p.name} (Usuario)`}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                        {p.email}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    }
                    <Button onClick={() => navigate("/")}>Regresar</Button>
                </div>
            </div>
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </>
    )
}

export default Friends;