import axios from "axios";


const server = axios.create({
    baseURL: process.env.REACT_APP_API_URL+"/api" || "https://twitter-ieea.onrender.com/api",
})  

server.interceptors.request.use(
    config => {
        config.headers.Authorization = localStorage.getItem("token")
        return config
    }, 
    err => {
        console.error(err)
    }
)

export default server