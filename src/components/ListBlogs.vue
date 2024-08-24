<script setup lang="ts">
import CommentsIcon from "@/components/icons/CommentsIcon.vue";
import router from "@/router";
import type { BLOG } from "@/util/types/types";
import EditIcon from "./icons/EditIcon.vue";

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
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 25px 10px;
}

.grid-item {
    width: auto;
    max-width: 340px;
    height: 270px;
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
    /* 4o8l fa5er gdn */
    transform: scale(1.05) rotateX(5deg) rotateY(5deg);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.item-title {
    display: -webkit-box;
    /* Needed for WebKit (Chrome, Safari) */
    -webkit-line-clamp: 2;
    line-clamp: 2;
    /* WebKit specific for multi-line ellipsis */
    -webkit-box-orient: vertical;
    /* Required for WebKit */
    overflow: hidden;
    /* Hide overflowing text */
    text-overflow: ellipsis;
    /* Add ellipsis (...) */
    line-height: 1.5;
    /* Adjust line height as needed */
    max-height: 4rem;
    /* (line-height * number of lines) */
    white-space: normal;
    /* Ensure text can wrap */
}

.item-content {
    display: -webkit-box;
    line-clamp: 5;
    -webkit-line-clamp: 5;
    /* Number of lines to display */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Optionally set max-width or width */
    max-width: 100%;
    margin-bottom: 1em;
}

.item-content {
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