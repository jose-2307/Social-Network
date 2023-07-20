import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';


const PostCard = ({inComments = false,image, title, description, likes, comments, author, giveLike, id}) => {
    return (
        <Card sx={{ width: 345 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {author[0]}
              </Avatar>
            }
            
            title={title}
            // subheader="September 14, 2016"
          />
          {image && (
            <CardMedia
              component="img"
              height="194"
              image={image}
              alt={title}
            />
          )}
          
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
          {!inComments && (
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites" onClick={() => giveLike(id)}>
                <FavoriteIcon /> {likes}
              </IconButton>
              <IconButton aria-label="share">
                <Link style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.54)"}} to={`/${id}/comments`}><p style={{margin: 0, fontSize: "20px"}}>Comentarios ({comments})</p></Link>
              </IconButton>
          </CardActions>
          )}
          
        </Card>
      );
}

export default PostCard;