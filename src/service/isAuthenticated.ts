//TODO: remove this, there is a method, isLogged in HttpRequestService
const isAuthenticated = () => localStorage.getItem("token") !== null
export default isAuthenticated