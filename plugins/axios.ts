import axios from "axios";
export default defineNuxtPlugin((NuxtApp) => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'https://tiktok-server-production.up.railway.app'
    return {
        provide: {
            axios: axios
        }
    }
})
