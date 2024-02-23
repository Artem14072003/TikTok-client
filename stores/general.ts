import {defineStore, type Store, type StoreDefinition} from 'pinia'
import axios from '../plugins/axios'
import {type IGetToken, type IUser, useUserStore} from "./user";
import type {AxiosResponse} from "axios/index";
import type {AxiosError} from "axios";

interface updateUser {
    id: string,
    image: string
}

interface Igeneral {
    isLoginOpen: boolean,
    isEditProfileOpen: boolean,
    selectedPost: { id: string; likes: {user_id: string, id: string}[]; user: {id: string}, comments?: string | undefined} | null,
    ids: null | string[],
    isBackUrl: string,
    posts: null | {id: string, likes: { user_id: string, id: string }[]}[],
    suggested: null | updateUser[],
    following: null | updateUser[]
}

interface Iactions {
    hasSessionExpired(): Promise<void>,

    allLowerCaseNoCaps(str: string): string,

    bodySwitch(val: boolean): "hidden" | "visible";

    getRandomUser(type: string): Promise<void>

    getPostById(id: string | string[]): Promise<void>

    setBackUrl(url: string): void

    updateSideMenuImage: (
        array: updateUser[] | null,
        user: Store<"user", IUser, {}, IGetToken>
    ) => void,

    getAllUserAndPost(): Promise<void>
}

// @ts-ignore
const $axios = axios().provide.axios

export const useGeneralStore: StoreDefinition<"general", Igeneral, {}, Iactions> = defineStore('general', {
    state: (): Igeneral => ({
        isLoginOpen: false,
        isEditProfileOpen: false,
        selectedPost: null,
        ids: null,
        isBackUrl: '/',
        posts: null,
        suggested: null,
        following: null
    }),
    actions: {
        bodySwitch(val: unknown) {
            if (val) return document.body.style.overflow = "hidden"
            return document.body.style.overflow = "visible"
        },
        allLowerCaseNoCaps(str) {
            return str.split(" ").join().toLowerCase()
        },
        setBackUrl(url) {
            this.isBackUrl = url
        },

        async hasSessionExpired() {
            $axios.interceptors.response.use((respons: AxiosResponse) => respons,
                (error: AxiosError) => {
                    switch (error.response && error.response.status) {
                        case 401:
                        case 419:
                        case 503:
                            useUserStore().resetUser()
                            window.location.href = "/"
                            break;
                        case 500:
                            alert('Ooops, something, went wrong! the team has been notified!');
                            break;
                        default:
                            return Promise.reject(error)
                    }
                })
        },

        async getRandomUser(type) {
            let res = await $axios.get(`/api/get-random-users`)


            if (type === 'suggested') {
                this.suggested = res.data.suggested
            }

            if (type === 'following') {
                this.following = res.data.following
            }
        },

        updateSideMenuImage(array, user) {
            if (array) {
                for (let i = 0; i < array.length; i++) {
                    const res = array[i];
                    if (res.id == user.id) {
                        res.image = user.image
                    }
                }
            }
        },

        async getAllUserAndPost() {
            let res = await $axios.get('/api/home');
            this.posts = res.data
            console.log(this.posts)
        },

        async getPostById(id) {
            let res = await $axios.get(`/api/posts/${id}`)

            this.$state.selectedPost = res.data.post[0];
            this.$state.ids = res.data.ids
        }
     },
    persist: true
})