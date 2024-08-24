<script setup lang="ts">
import BlogPreview from '@/components/BlogPreview.vue';
import { importBlog, importBlogs } from '@/util/methods';
import type { BLOG, COMMENT } from '@/util/types/types';
import { ref, onMounted } from 'vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import SaveIcon from '@/components/icons/SaveIcon.vue';
import axios from 'axios';
import { API_URL } from '@/util/constants';

const blogs = ref<BLOG[]>([]);
const filteredComments = ref<{
    blog: BLOG,
    comment: COMMENT
}[]>([]);

const userId = ref<number>();

onMounted(() => {
    userId.value = parseInt(localStorage.getItem('userId') as string);

    importBlogs().then((data) => {
        blogs.value = data;

        console.log('Number of blogs:', blogs.value.length);

        for (let i = 0; i < blogs.value.length; i++) {
            importBlog(blogs.value[i].slug as string).then((data) => {
                if (data.comments) {
                    for (let j = 0; j < data.comments.length; j++) {

                        if (data.comments[j].user?.id === userId.value) {
                            if (data.user?.id === userId.value) {
                                blogs.value[i].editMode = true;
                            }
                            filteredComments.value.push({
                                blog: blogs.value[i],
                                comment: data.comments[j]
                            });
                        }
                    }
                }
            });
        }
        console.log('Number of comments:', filteredComments.value.length);
    }).catch((error) => {
        console.error("Error fetching blogs:", error);
    });
});


const editComment = (comment: COMMENT) => {
    // Handle the edit comment logic here
    console.log('Edit comment:', comment);
    comment.editMode = true;
};

const saveComment = (comment: COMMENT, blog: BLOG) => {
    // Handle the save comment logic here
    console.log('Save comment:', comment);
    axios.put(`/posts/${blog.slug}/comments/${comment.id}`, comment,
        {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    ).then((response) => {
        console.log('Comment saved:', response.data);
        comment.editMode = false;
    }).catch((error) => {
        console.error('Error saving comment:', error);
    });
};

const deleteComment = (comment: COMMENT, blog: BLOG) => {
    // Handle the delete comment logic here
    console.log('Delete comment:', comment);
    axios.delete(`/posts/${blog.slug}/comments/${comment.id}`,
        {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    ).then((response) => {
        console.log('Comment deleted:', response.data);
        const index = filteredComments.value.findIndex((item) => item.comment.id === comment.id);
        filteredComments.value.splice(index, 1);
    }).catch((error) => {
        console.error('Error deleting comment:', error);
    });
};


</script>

<template>
    <main class="comments-container">
        <h2>My Comments</h2>
        <div v-if="filteredComments.length" class="comments-list">
            <div v-for="(comment, index) in filteredComments" :key="index" class="comment-card">
                <div class="comment-components">
                    <div class="comment-items">
                        <div class="comment-header">
                            <h3 class="in-liner">
                                {{ comment.comment.user?.name }}
                                <div class="comment-actions">
                                    <div class="comment-action">
                                        <div v-if="comment.comment.editMode" class="comment-action"
                                            @click="saveComment(comment.comment, comment.blog)">
                                            <span>Save</span>
                                            <SaveIcon class="icon save-icon" />
                                        </div>
                                        <div v-else class="comment-action" @click="editComment(comment.comment)">
                                            <span>Edit</span>
                                            <EditIcon class="icon edit-icon" />
                                        </div>
                                    </div>
                                    <div class="comment-action" @click="deleteComment(comment.comment, comment.blog)">
                                        <span>Delete</span>
                                        <DeleteIcon class="icon delete-icon" />
                                    </div>
                                </div>
                            </h3>
                        </div>
                        <div class="comment-content">

                            <input v-if="comment.comment.editMode" type="text" v-model="comment.comment.content" />
                            <p v-else>{{ comment.comment.content }}</p>
                        </div>
                    </div>
                    <div class="comment-blog">
                        <BlogPreview :blog="comment.blog" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="no-comments">
            <p>You have not posted any comments yet.</p>
        </div>
    </main>
</template>


<style scoped>
.comments-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.comment-items {
    flex: 1;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: var(--color-text-1);
}

.in-liner {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}



.comment-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.comment-action {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    padding: 5px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.comment-action:hover {
    background-color: var(--color-muted);
    color: var(--color-text-1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.comment-components {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;

}

.comment-blog {

    min-width: 300px;
    padding: 5px;
    background-color: var(--color-muted);
    border-radius: 8px;
}

.comment-card {
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.comment-header h3 {
    font-size: 18px;
    color: var(--color-text-1);
    margin-bottom: 10px;
}

.comment-content {
    height: 100%;
    margin: 0;
    padding: 0;
    word-wrap: break-word;
    overflow: hidden;
    /* Prevents overflow within the content area */
}

.comment-content p {
    font-size: 16px;
    color: var(--color-text-1);
    margin: 0;
    padding: 0;
    line-height: 1.5;
    /* Adjust line-height if needed */
}

.comment-content input {
    font-size: 16px;
    color: var(--color-text-1);
    margin: 0;
    padding: 5px;
    line-height: 1.5;
    /* Adjust line-height if needed */
    width: 100%;
    background-color: transparent;
    outline: none;
}

.no-comments {
    text-align: center;
    color: #999;
    font-size: 16px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
