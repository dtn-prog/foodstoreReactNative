import axios from "axios";

export const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(response.data);
        return response.data;
    } catch(error) {
        console.log(error);
        return error;
    }
}

export const baseUrl = 'http://10.0.2.2:8000';