import axios from "axios";

const instance=axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

console.log('API URL:', process.env.REACT_APP_API_URL);

export default instance;