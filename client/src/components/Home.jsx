import { useEffect, useState } from "react";
import { getPostsBack } from "../services/posts.service";
import Loader from "./Loader";
import "./styles/Home.css";
import { Autocomplete, TextField } from "@mui/material";
import { getUsersBack } from "../services/user.service";


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [usersPosts, setUsersPosts] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchFeedUsers = async () => {
            try {
                const data = await getPostsBack();
                setUsersPosts(data);
                const resp = await getUsersBack();
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

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }
console.log(users)
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={users}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="User" />}
            />
            <h1>Feed usuarios</h1>
            <div className="container-all">
                <div className="container-posts">
                    {usersPosts.length === 0 
                        ?   <h3>No hay posts</h3>
                        :   (
                            usersPosts.map(p => (
                                <div className="container-post" key={p._id}>
                                    <h3>{p.title}</h3>
                                    <p>{p.description}</p>
                                    <section>
                                        <p style={{paddingRight: "10px"}}>{p.likes} likes</p>
                                        <p>{p.comments} comentarios</p>
                                    </section>
                                    <p>Autor: {p.user}</p>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </div>

    )
}

export default Home;