import { Card, CardContent, Typography } from "@mui/material";

const CommentData = ({comment, user}) => {
    return (
        <div style={{borderBottom: "1px solid grey", width: 345}}>
            <CardContent >
                <Typography variant="body2" color="text.secondary">{user}: {comment}</Typography>
            </CardContent>
        </div>
    )   
}

export default CommentData;