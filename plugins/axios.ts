import axios from "axios";
export default defineNuxtPlugin((NuxtApp) => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'tiktok-server.railway.internal'
    return {
        provide: {
            axios: axios
        }
    }
})
