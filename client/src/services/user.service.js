import { fetchWrapper } from "./auth.service";

const ENDPOINT = "http://localhost:3000/api/v1/profile/user";

export const getUsersBack = async () => {
    const response = await fetchWrapper(ENDPOINT);
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Error obtiendo users.")
    }
}