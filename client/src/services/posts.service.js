import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:3000/api/v1/profile/post";


export const getPostsBack = async (isCommunity) => {
    let response;
    if (isCommunity) {
        response = await fetchWrapper(`${ENDPOINT}?isCommunity=${isCommunity}`);
    } else {
        response = await fetchWrapper(`${ENDPOINT}`);

    }
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo posts.")
    }
}

export const getPostBack = async (id) => {
    const response = await fetchWrapper(`${ENDPOINT}/${id}`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo el post.")
    }
}

export const createPostBack = async ({title, description}) => {
    const response = await fetchWrapper(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
            title,
            description
        }),
    });
    if(response.ok) {
        return response.json();
    } else{
        throw new Error("Error creando el post.");
    }
}

export const createLikeBack = async (postId) => {
    const response = await fetchWrapper(`${ENDPOINT}/${postId}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if(response.ok) {
        return response.json();
    } else if (response.status == 409) {
        throw new Error("El like ya existe.");
    } else{
        throw new Error("Error dando like.");
    }
}


export const removeLikeBack = async (postId) => {
    const response = await fetchWrapper(`${ENDPOINT}/${postId}/like`, {
        method: "DELETE",
    });
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error quitando like.")
    }
}

export const getCommentBack = async (id) => {
    const response = await fetchWrapper(`${ENDPOINT}/${id}/comment`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo comentarios.")
    }
}

export const postCommentBack = async (id, {comment}) => {
    const response = await fetchWrapper(`${ENDPOINT}/${id}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
            comment,
        }),
    });
    if(response.ok) {
        return response.json();
    } else{
        throw new Error("Error comentando.");
    }
}