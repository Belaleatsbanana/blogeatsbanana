<script setup lang="ts">
import { ref } from 'vue';
import HomeIcon from './icons/HomeIcon.vue';
import PostIcon from './icons/PostIcon.vue';
import MyPostsIcon from './icons/MyPostsIcon.vue';
import CommentsIcon from './icons/CommentsIcon.vue';

const isMyPostsDisabled = ref(true);
const isCommentsDisabled = ref(true);

</script>

<template>
    
    <main class="navbar-container">

        <header class="navbar-header">

            <img src="../assets/blog.jpg" alt="logo" class="navbar-img" />
            <h5>BananaBlog</h5>

        </header>

        <nav class="navbar">

            <ul class="column-bar">

                <li><router-link to="/home">
                        <HomeIcon class="icon" height="20px" width="20px" />
                        <span>Dashboard</span>
                    </router-link>
                </li>
                <li><router-link to="/post">
                        <PostIcon class="icon" height="25px" width="25px" />
                        <span>New Post</span>
                    </router-link>
                </li>
                <li>
                    <router-link v-if="!isMyPostsDisabled" to="/myposts">
                        <MyPostsIcon class="icon" height="25px" width="25px" />
                        <span>My Posts</span>
                    </router-link>
                    <span v-else class="disabled">
                        <MyPostsIcon class="icon" height="25px" width="25px" />
                        <span>My Posts</span>
                    </span>
                </li>
                <li>
                    <router-link v-if="!isCommentsDisabled" to="/comments">
                        <CommentsIcon class="icon" height="25px" width="25px" />
                        <span>Comments</span>
                    </router-link>
                    <span v-else class="disabled">
                        <CommentsIcon class="icon" height="25px" width="25px" />
                        <span>Comments</span>
                    </span>
                </li>
            </ul>

        </nav>

        <footer>
            <p>&copy; BananaBlog 2024</p>
        </footer>

    </main>

</template>

<style scoped>
.navbar-container {
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    background-color: var(--color-background-3);
}

.navbar-header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px;
    width: 100%;
}

.navbar-img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

.navbar {
    height: 100%;
}

.column-bar {
    margin-top: 3em;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding: 0 20px;
    list-style-type: none;
    height: 100%;
    min-width: 150px;
    width: 100%;
    text-align: left;
}

.column-bar li {
    margin: 10px 0;
    border-radius: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.column-bar li a,
.column-bar li .disabled {
    color: var(--color-text-1);
    transition: color 0.3s ease;
    text-decoration: none;
    display: flex;
    justify-content: left;
    align-items: stretch;
    width: 100%;
    height: 100%;
    padding: 10px 10px;
    box-sizing: border-box;
    gap: 5px;
}

.column-bar li .disabled {
    border-radius: 5px;
    background-color: gray;
    cursor: not-allowed;
}

.column-bar li:hover .disabled {
    color:red;
    cursor: not-allowed;
}

.column-bar li:hover .disabled .icon {
    fill: rgb(255, 0, 0);
}

.column-bar li a.router-link-exact-active {
    background-color: var(--color-background-2);
    color: var(--color-text-2);
    border-radius: 5px;
    box-shadow: 2px 2px 15px 2px rgba(0, 0, 0, 0.2);
}

.column-bar li:hover a {
    background-color: var(--color-background-2);
    color: var(--color-text-2);
    border-radius: 5px;
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
}

.column-bar li a.router-link-exact-active:hover {
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
}

.icon {
    fill: var(--color-text-1);
    transition: fill 0.3s ease;
}

.column-bar li:hover .icon,
.column-bar li .router-link-exact-active .icon {
    fill: var(--color-text-2);
}
</style>
