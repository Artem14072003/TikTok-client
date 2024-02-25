import axios from "axios";
export default defineNuxtPlugin((NuxtApp) => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'https://tiktok-client.railway.internal'
    return {
        provide: {
            axios: axios
        }
    }
})
