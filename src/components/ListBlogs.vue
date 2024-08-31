<script setup lang="ts">
import CommentsIcon from "@/components/icons/CommentsIcon.vue";
import router from "@/router";
import type { BLOG } from "@/util/types/types";
import EditIcon from "./icons/EditIcon.vue";
import { computed, ref } from "vue";

import defaultImage from "@/assets/BananaBlog.png";

const props = defineProps<{
    blogs: BLOG[];
}>();

const imgSrc = ref<string>(defaultImage);
const userId = parseInt(localStorage.getItem("userId") as string);

const gridBlogs = computed(() => {
    console.log(props.blogs);
        
    return props.blogs.map((blog) => {
        return {
            ...blog,
            editMode: blog.user?.id === userId
        };
    });
});


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
        <div class="grid-item" v-for="blog in gridBlogs" :key="blog.slug" @click="openBlog(blog.slug)">
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
                <div v-if="blog.last_comment" class="last-comment">
                    <h3>Most Recent Comment</h3>
                    <span class="last-comment-content"> {{blog.last_comment.content }} </span>
                    <br/>
                    <small>— {{ blog.last_comment.user?.name }}, {{ blog.last_comment.created_at_readable }}</small>
                </div>
                <div v-else class="last-comment">
                    <span class="last-comment-content">Be the first to comment!</span>
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
h3  {
    text-align: center;
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
    height: auto; /* Adjust height to accommodate more content */
    min-height: 520px;
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
    height: 150px;
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
    position: relative;
}

.last-comment {
    font-size: 0.75rem;
    min-height: 120px;
    color: var(--color-text-1);
    margin-top: 1em;
    border-top: 1px solid var(--color-background-1);
    padding-top: 0.5em;
}

.last-comment-content {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.blog-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    bottom: 10px;
    left: 10px;
    font-size: 0.875rem;
    color: var(--color-text-1);
    padding: 2px 4px;
    border-radius: 2px;
}

.in-liner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    gap: 1rem;
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
}
</style>
