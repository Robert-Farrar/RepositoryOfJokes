import axiosClient from "./axiosClient";

export const userService = {
    getAllJokes: async () =>
    {
        const response = await axiosClient.get('/Joke/');
        return response.data;
    },
    getOneJoke : async (id) => {
        const response = await axiosClient.get(`/Joke/${id}`);
        return response.data;
    },
    countJokes : async () => {
        const response = await axiosClient.get('/Joke/Count');
        return response.data.totalJokes;
    }
};