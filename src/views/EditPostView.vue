<script setup lang="ts">
import { API_URL } from '@/util/constants';
import axios from 'axios';
import { STATUS_CODES } from '@/util/constants';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { importBlog } from '@/util/methods';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import router from '@/router';


const route = useRoute();

const title = ref('');
const content = ref('');

const slug = ref<string>();


onMounted(async () => {
    console.log('mounted');

    slug.value = route.params.slug as string;

    await importBlog(slug.value).then((result) => {
        title.value = result.title as string;
        content.value = result.content as string;
    });
});

const updatePost = () => {
    axios.put(`/posts/${slug.value}`, {
        title: title.value,
        content: content.value,
    }, {
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    ).then((response) => {
        if (response.status === STATUS_CODES.OK) {
            console.log('Post updated successfully');
        }
    });
}

const deleteBlog = (slug?: string) => {
    if (slug) {
        console.log("Delete blog:", slug);
        axios.delete(`/posts/${slug}`, {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(() => {
            router.push({ name: "Home" });
        }).catch((error) => {
            console.error(error);
        });
    }
};

</script>

<template>
    <main class="new-post">
        <div class="in-liner">
            <h1>Edit Post</h1>
            <div class="delete-action" @click="deleteBlog(slug)">
                <span>Delete Post</span>
                <DeleteIcon />
            </div>
        </div>
        <form @submit.prevent="updatePost" class="post-form">
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
                <button type="submit">Save</button>
            </div>
        </form>
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
}

.in-liner {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    width: 100%;
}

.delete-action {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    position: absolute;
    right: 0;
    padding: 8px;
    border-radius: 4px;
    transition: color 0.3s, background-color 0.3s, transform 0.3s;
}

.delete-action:hover {
    color: #EF2D56;
    background-color: var(--color-background-1);
    transform: scale(1.1);
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
