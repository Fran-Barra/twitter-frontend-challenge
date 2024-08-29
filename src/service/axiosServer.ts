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
        //TODO: add a "middleware" or interceptor for toast, considering the path 
        //of the error the toast should have different messages
        //this would offer less control
        //PROBLEM => cant use use effect here
        
        console.error(err)
        
        if (axios.isAxiosError(err)) {
            console.log(err.code);

            if (err.status === 401 || err.code === 'ERR_NETWORK') {
                //TODO: SHOULD NOTIFY CONNECTION ERROR
                localStorage.removeItem("token");
                window.location.href = '/sign-in'
                return
            }     
        }   
        return Promise.reject(err)
    }
)

export default server