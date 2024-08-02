const isAuthenticated = () => localStorage.getItem("token") !== null
export default isAuthenticated