<script setup lang="ts">
import { API_URL } from '@/util/constants';
import type { BLOG } from '@/util/types/types';
import axios from 'axios';
import { STATUS_CODES } from '@/util/constants';
import { ref } from 'vue';
import PopUp from '@/components/PopUp.vue';

const title = ref('');
const content = ref('');

const popupMessage = ref('');
const visible = ref(false);

const submitPost = () => {
    const blog: BLOG = {
        title: title.value,
        content: content.value,
    };
    axios.post("/posts", blog,
        {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    ).then((response) => {
        console.log(response.data);

        popupMessage.value = 'Post created successfully!';
        visible.value = true;
        resetForm();
    }).catch((err) => {

        if (err.response.status === STATUS_CODES.UNPROCESSABLE) {
            if (err.response.data.errors.title) {
                title.value = err.response.data.errors.title[0];
            }
            if (err.response.data.errors.content) {
                content.value = err.response.data.errors.content[0];
            }
        }

    });
};

const resetForm = () => {
    title.value = '';
    content.value = '';
};
</script>

<template>
    <main class="new-post">
        <h1>Create New Post</h1>

        <form @submit.prevent="submitPost" class="post-form">
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="title" placeholder="Enter post title" required />
            </div>

            <div class="form-group">
                <label for="content">Content:</label>
                <textarea id="content" v-model="content" placeholder="Write your post content here" rows="10"
                    required></textarea>
            </div>

            <div class="form-actions">
                <button type="submit">Submit</button>
                <button type="button" @click="resetForm">Reset</button>
            </div>
        </form>
        <PopUp :message="popupMessage" :visible="visible" @update:visible="visible = $event" />
    </main>
</template>

<style scoped>
.new-post {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
}

h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
}

.post-form {
    width: 100%;
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-size: 1rem;
    color: #444;
    margin-bottom: 8px;
    display: block;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 5px;
}

textarea {
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #444140;
    color: #fff;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #EF2D56;
}
</style>
