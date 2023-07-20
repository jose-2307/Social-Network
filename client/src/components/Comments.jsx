import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getCommentBack, getPostBack, postCommentBack } from "../services/posts.service";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/Home.css"
import PostCard from "./PostCard";
import CommentData from "./CommentData";
import { Button, Card, TextField } from "@mui/material";
import TextInput from "./TextInput";

const Comments = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState({});
    const navigate = useNavigate();
    const {id = ""} = useParams();

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchFeedUsers = async () => {
            try {
                const postData = await getPostBack(id);
                setPost(postData);
                const data = await getCommentBack(id);
                setComments(data);
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

    const handleSubmit = async (e) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            e.preventDefault();
            const data = Array.from(new FormData(e.target))
            let newComment = Object.fromEntries(data).comment;
            newComment = await postCommentBack(id, {comment: newComment});
            console.log(newComment)
            setComments([...comments, newComment.newComment]);
            
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

    return (
        <>
            {
                comments.length === 0 
                ? (
                    <>
                    <div>No hay comentarios</div>
                    <form style={{display: "flex", flexDirection: "row"}} onSubmit={handleSubmit}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Comentario"
                                    multiline
                                    rows={3}
                                    name="comment"
                                />
                                <Button type="submit" variant="outlined"> guardar</Button>
                            </form>
                            <br></br>
                            <Button onClick={() => navigate("/")}>Regresar</Button>
                    </>
                )

                : (
                    <div className="container-all">
                        <div className="container-posts">
                            <h3>Comentarios ({comments.length})</h3>
                            {post.image 
                                ? <PostCard key={post._id} inComments={true} image={post.image} title={post.title} description={post.description} author={post.user}/>
                                : <PostCard key={post._id} inComments={true} title={post.title} description={post.description} author={post.user}/>
                            }
                            <br></br>
                            <Card style={{ overflowY: "auto", height: 400}}>
                                {comments.map(c => (
                                    <CommentData key={c._id} comment={c.comment} user={c.name}/>
                                ))}
                            </Card>
                            <br></br>
                            <form style={{display: "flex", flexDirection: "row"}} onSubmit={handleSubmit}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Comentario"
                                    multiline
                                    rows={3}
                                    name="comment"
                                />
                                <Button type="submit" variant="outlined"> guardar</Button>
                            </form>
                            <br></br>
                            <Button onClick={() => navigate("/")}>Regresar</Button>
                        </div>
                    </div>
                )
            }
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </>

        
    )
}

export default Comments;