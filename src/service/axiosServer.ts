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

server.interceptors.response.use(
    null,
    err => {
        console.error(err)
        if (!axios.isAxiosError(err)) return
        if (err.status === 401) {
            localStorage.removeItem("token");
            window.location.href = '/sign-in'
        }
    }
)

export default server