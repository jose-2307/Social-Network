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


export const createLikeBack = async (productId) => {
    const response = await fetchWrapper(`${ENDPOINT}/${productId}/like`, {
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


export const removeLikeBack = async (productId) => {
    const response = await fetchWrapper(`${ENDPOINT}/${productId}/like`, {
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