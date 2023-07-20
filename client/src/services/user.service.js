import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:3000/api/v1/profile";

export const getUsersBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/user`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo users.")
    }
}

export const getTagsBack = async () => {
    const response = await fetchWrapper(`${ENDPOINT}/tags`);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo tags.")
    }
}

export const updateTagBack = async (id) => {
    const response = await fetchWrapper(`${ENDPOINT}/tags`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
        }),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error actualizando el tag.")
    }
}