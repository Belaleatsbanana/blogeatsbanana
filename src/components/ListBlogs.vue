<script setup lang="ts">
import CommentsIcon from "@/components/icons/CommentsIcon.vue";
import router from "@/router";
import type { BLOG } from "@/util/types/types";
import EditIcon from "./icons/EditIcon.vue";
import { ref } from "vue";

import defaultImage from "@/assets/BananaBlog.png";

const imgSrc = ref<string>(defaultImage);

defineProps<{
    blogs: BLOG[];
}>();

const openBlog = (slug?: string) => {
    if (slug) {
        console.log(slug);
        router.push({ name: "BlogPost", params: { slug } });
    }
};

const editBlog = (slug?: string) => {
    if (slug) {
        console.log(slug);
        router.push({ name: "EditPost", params: { slug } });
    }
};
</script>

<template>
    <main class="grid-container">
        <div class="grid-item" v-for="blog in blogs" :key="blog.slug" @click="openBlog(blog.slug)">
            <img v-if="blog.image_thumb" :src="blog.image_thumb" alt="Blog image" class="blog-image" />
            <img v-else :src="imgSrc" alt="Blog img" class="blog-image" />
            <div class="item-content">
                <h2 class="item-title">{{ blog.title }}</h2>
                <p class="item-content">{{ blog.content }}</p>
            </div>
            <div class="blog-footer">
                <div class="in-liner">
                    <span>Posted by: @{{ blog.user?.name }}</span>
                    <div v-if="blog.editMode" class="edit-icon" @click.stop="editBlog(blog.slug)">
                        <EditIcon />
                    </div>
                </div>
                <div class="in-liner">
                    <span>Published : {{ blog.created_at?.split('T')[0] }}</span>
                    <div class="comments-container">
                        <CommentsIcon /> <span>{{ blog.comments_count }}</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
p {
    line-height: 1.2;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-1);
    font-weight: 400;
}

.grid-container {
    margin-top: 2em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    gap: 25px 10px;
}

.grid-item {
    width: auto;
    min-width: 330px;
    max-width: 600px;
    height: 420px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 5px;
    background-color: var(--color-background-3);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    cursor: pointer;
    z-index: 1;
}

.grid-item:hover {
    transform: scale(1.05) rotateX(5deg) rotateY(5deg);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.blog-image {
    width: 100%;
    height: 150px; /* Fixed height for images */
    object-fit: cover;
    border-radius: 4px;
}

.item-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    max-height: 4rem;
    white-space: normal;
}

.item-content {
    display: -webkit-box;
    line-clamp: 5;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    margin-bottom: 1em;
    flex: 1;
}

.blog-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: 0.875rem;
    color: var(--color-text-1);
    padding: 2px 4px;
    margin-top: 1em;
    border-radius: 2px;
}

.in-liner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 0.5rem 1rem 0 0;
}

.edit-icon {
    padding: 0.5em;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s;
    border-radius: 50%;
}

.edit-icon:hover {
    transform: scale(1.2);
    background-color: var(--color-background-1);
    z-index: 10;
}

.comments-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
}
</style>
