import axiosClient from "./axiosClient";

export const adminService = {
    getAllJokes: async () =>
    {
        const response = await axiosClient.get('/Joke/');
        return response.data;
    },
    getOneJoke : async (id) => {
        const response = await axiosClient.get(`/Joke/${id}`);
        return response.data;
    },
    removeJoke: async (id) => {
        const response = await axiosClient.post('/Joke/Rm', id);
        return response.status;
    },
    addJoke: async (joke) => {
        const payload = {
            setup: joke.setup,
            punchline : joke.punchline
        };

        const response = await axiosClient.post('/Joke/Add', payload);
        return response.data;
    },
    updateJoke: async (id, joke) => {
        const payload = {
            Setup: joke.setup,
            Punchline: joke.punchline
        };

        const response = await axiosClient.put(`/Joke/Update/${id}`, payload);
        return response.status;
    }
};