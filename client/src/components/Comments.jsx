import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getCommentBack, getPostBack } from "../services/posts.service";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/Home.css"
import PostCard from "./PostCard";
import CommentData from "./CommentData";
import { Card } from "@mui/material";

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
    console.log(comments)
    console.log(post)
    return (
        <>
            {
                comments.length === 0 
                ? <div>No hay comentarios</div>
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
                            
                        </div>
                    </div>
                )
            }
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </>

        
    )
}

export default Comments;