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