import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:3000/api/v1/profile/user";
const ENDPOINT2 = "http://localhost:3000/api/v1/profile/recommendations";
const ENDPOINT3 = "http://localhost:3000/api/v1/profile/follow";


export const getUsersBack = async () => {
    const response = await fetchWrapper(ENDPOINT);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo users.")
    }
}

export const getUsersFollow = async () => {
    const response = await fetchWrapper(ENDPOINT2);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo users.")
    }
}


export const createFollow = async (id) => {
    const response = await fetchWrapper(ENDPOINT3, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id}),
    });
    if(response.ok) {
        return response.json();
    } 
    else{
        throw new Error("Error al crear follow.");
    }
}
