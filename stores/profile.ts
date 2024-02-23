import {defineStore, type StoreDefinition} from 'pinia'
import axios from "~/plugins/axios";

// @ts-ignore
const $axios = axios().provide.axios

interface IProfile {
    id: string,
    name: string,
    bio: string,
    image: string,
    post: null,
    posts: null | { id: string; likes: {user_id: string, id: string}[]; user: {id: string}, comments?: string | undefined}[] ,
    allLikes: 0
}

interface IProfileActions {
    getProfile(id: string | string[]): Promise<void>;

    resetUser(): void,

    allLikesCount(): void
}

export const useProfileStore: StoreDefinition<"profile", IProfile, {}, IProfileActions> = defineStore('profile', {
    state: (): IProfile => ({
        id: '',
        name: '',
        bio: '',
        image: '',
        post: null,
        posts: null,
        allLikes: 0
    }),
    actions: {
        async getProfile(id) {
            this.resetUser()
            let res = await $axios.get(`/api/profiles/${id}`)

            this.$state.id = res.data.user[0].id
            this.$state.name = res.data.user[0].name
            this.$state.bio = res.data.user[0].bio
            this.$state.image = res.data.user[0].image

            this.$state.posts = res.data.posts
            this.allLikesCount()
        },

        allLikesCount() {
            this.allLikes = 0
            if (this.posts) {
                for (let i = 0; i < this.posts.length; i++) {
                    const post = this.posts[i];
                    for (let j = 0; j < post.likes.length; j++) {
                        this.allLikes++
                    }
                }
            }
        },

        resetUser() {
            this.$state.id = '';
            this.$state.name = "";
            this.$state.bio = "";
            this.$state.image = ""
            this.$state.posts = null
        }
    },
    persist: true
})