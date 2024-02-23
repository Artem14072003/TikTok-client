import axios from '../plugins/axios'
import {defineStore, type StoreDefinition} from "pinia";
import {useGeneralStore} from "./general";


export interface IUser {
    id: string,
    name: string,
    bio: string,
    image: string,
    email?: string
}

export interface IGetToken {
    getToken(): Promise<void>;

    login(email: string, password: string): Promise<void>,

    getUser(): Promise<void>,

    register(
        name: string,
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<void>;

    createPost(data: FormData): Promise<{ status: number }>

    updateUserImage(data: FormData): Promise<{ status: number }>

    updateUser(name: string, bio: string): Promise<{ status: number }>

    likePost(post: {
        id: string,
        likes: { user_id: string, id: string }[];
        user: { id: string }
    }, isPostPage?: boolean): Promise<void>

    addComment(post: {
        id: string,
        likes: { user_id: string, id: string }[];
        user: { id: string }
    }, comment: string): Promise<void>,

    updateComments(post: { id: string, likes: { user_id: string, id: string }[]; user: { id: string } }): Promise<void>,

    unlikePost(post: {
        id: string,
        likes: { user_id: string, id: string }[];
        user: { id: string }
    }, isPostPage?: boolean): Promise<void>;

    deleteComment(
        post: { id: string, likes: { user_id: string, id: string }[]; user: { id: string } },
        commentId: string
    ): Promise<void>,

    deletePost(
        post: {
            id: string;
            likes: { user_id: string, id: string }[];
            user: { id: string },
            comments?: string | undefined
        }
    ): Promise<void>

    logout(): Promise<void>;

    resetUser(): void
}


// @ts-ignore
const $axios = axios().provide.axios

export type TUserStore = StoreDefinition<"user", IUser, {}, IGetToken>

export const useUserStore: TUserStore = defineStore('user', {
    state: (): IUser => ({
        id: '',
        name: '',
        bio: '',
        image: '',
    }),
    actions: {
        async getToken() {
            await $axios.get('/sanctum/csrf-cookie')
        },
        async login(email, password) {
            await $axios.post('/login', {
                email,
                password
            })
        },

        async register(
            name,
            email,
            password,
            confirmPassword
        ) {
            await $axios.post('/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            })
        },

        async getUser() {
            let res = await $axios.get('/api/logged-in-user');

            this.$state.id = res.data[0].id;
            this.$state.name = res.data[0].name;
            this.$state.bio = res.data[0].bio;
            this.$state.email = res.data[0].email
            this.$state.image = res.data[0].image
        },
        async logout() {
            await $axios.post('/logout');
            this.resetUser();
        },

        async createPost(data) {
            return await $axios.post('/api/posts', data)
        },

        async deletePost(post) {
            return await $axios.delete(`/api/posts/${post.id}`)
        },

        async updateUserImage(data) {
            return await $axios.post('/api/update-user-image', data)
        },

        async updateUser(name, bio) {
            return await $axios.patch('/api/update-user', {
                name: name,
                bio: bio
            })
        },

        async likePost(post, isPostPage) {
            console.log(post.id)
            let res = await $axios.post('/api/likes', {
                post_id: post.id,
            })

            let singlePost = null

            if (isPostPage) {
                singlePost = post
            } else {
                singlePost = useGeneralStore().posts?.find(p => p.id === post.id)
            }
            singlePost?.likes.push(res.data.like)
        },

        async unlikePost(post, isPostPage) {
            let deleteLike: null | { user_id: string, id: string } = null
            let singlePost = null

            if (isPostPage) {
                singlePost = post
            } else {
                singlePost = useGeneralStore().posts?.find(p => p.id === post.id)
            }

            singlePost?.likes.forEach(like => {
                if (like.user_id === this.id) {
                    deleteLike = like
                }
            });

            if (deleteLike && singlePost) {
                let res = await $axios.delete('/api/likes/' + (deleteLike as { id: string }).id)

                for (let i = 0; i < singlePost.likes.length; i++) {
                    const like = singlePost.likes[i];
                    if (like.id === res.data.like.id) {
                        singlePost.likes.splice(i, 1);
                    }
                }
            }

        },

        async addComment(post, comment) {
            let res = await $axios.post('/api/comments', {
                post_id: post.id,
                comment: comment
            })

            if (res.status === 200) {
                await this.updateComments(post)
            }
        },

        async updateComments(post) {
            let res = await $axios.get(`/api/profiles/${post.user.id}`)

            for (let i = 0; i < res.data.posts.length; i++) {
                const updatePost = res.data.posts[i];

                if (post.id === updatePost.id) {
                    const generalStore = useGeneralStore();

                    generalStore.selectedPost && post.id === updatePost.id &&
                    (generalStore.selectedPost.comments = updatePost.comments);
                }
            }
        },

        async deleteComment(post, commentId) {
            let res = await $axios.delete(`/api/comments/${commentId}`, {
                post_id: post.id
            })

            if (res.status === 200) {
                await this.updateComments(post)
            }
        },

        resetUser() {
            this.$state.id = '';
            this.$state.name = "";
            this.$state.email = ""
            this.$state.bio = "";
            this.$state.image = ""
        }
    },
    persist: true
})