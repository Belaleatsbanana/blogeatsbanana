<script setup lang="ts">
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import PopUp from '@/components/PopUp.vue';
import router from '@/router';
import { API_URL } from '@/util/constants';
import { importBlog } from '@/util/methods';
import type { BLOG } from '@/util/types/types';
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const slug = ref<string>();
const commentId = ref<number>(0);

const blogPost = ref<BLOG>();
const userId = parseInt(localStorage.getItem('userId') as string);
const commentMode = ref<'create' | 'edit'>('create');

const showComments = ref(false);
const commentsPosition = ref({ top: 80, left: 20 });
const isDragging = ref(false);
const startMousePosition = ref({ x: 0, y: 0 });
const startPosition = ref({ left: 0, top: 0 });
const maxHeight = ref(200);

const isPopUpVisible = ref(false);
const popUpMessage = ref('Edit your comment');
const popUpInput = ref<string>('');
const currentCommentIndex = ref<number | null>(null);

const toggleComments = () => {
    showComments.value = !showComments.value;
};

const fetchBlogPost = () => {
    importBlog(slug.value as string).then((result) => {
        blogPost.value = result;
    });
};

const refresh = () => {
    fetchBlogPost();
};

const startDrag = (event: MouseEvent) => {
    isDragging.value = true;
    startMousePosition.value = { x: event.clientX, y: event.clientY };
    startPosition.value = { ...commentsPosition.value };
};

const onDrag = (event: MouseEvent) => {
    if (isDragging.value) {
        const dx = event.clientX - startMousePosition.value.x;
        const dy = event.clientY - startMousePosition.value.y;

        let newLeft = startPosition.value.left + dx;
        let newTop = startPosition.value.top + dy;

        const maxLeft = window.innerWidth - 320;
        const maxTop = window.innerHeight - maxHeight.value;

        commentsPosition.value.left = Math.max(0, Math.min(newLeft, maxLeft));
        commentsPosition.value.top = Math.max(0, Math.min(newTop, maxTop));
    }
};

const stopDrag = () => {
    isDragging.value = false;
};

const editBlog = (slug?: string) => {
    if (slug) {
        router.push({ name: "EditPost", params: { slug } });
    }
};

const deleteBlog = (slug?: string) => {
    if (slug) {
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

const saveComment = (comment: { id?: number; content: string }) => {
    if (comment.id !== undefined) {
        updateCommentToApi(comment);
    } else {
        createNewCommentToApi(comment.content);
    }
    isPopUpVisible.value = false;


};

const createNewCommentToApi = (content: string) => {
    axios.post(`/posts/${slug.value}/comments`,
        {
            content: content
        }
        , {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(() => {
            console.log(content);

            console.log('Comment added');
            refresh();
        }).catch((error) => {
            console.log(content);

            console.log('Error adding comment');

            console.error(error);
        });
}

const updateCommentToApi = (comment: { id?: number; content: string }) => {
    axios.put(`/posts/${slug.value}/comments/${comment.id}`, comment, {
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then(() => {
        console.log('Comment updated');
        refresh();
    }).catch((error) => {
        console.error(error);
    });
}


const editComment = (index: number) => {
    popUpMessage.value = "Edit your comment";
    popUpInput.value = blogPost.value?.comments?.[index].content || '';
    commentId.value = blogPost.value?.comments?.[index].id || 0;

    commentMode.value = 'edit';
    currentCommentIndex.value = index;
    isPopUpVisible.value = true;
};

const deleteComment = (index: number) => {
    const commentId = blogPost.value?.comments?.[index].id;
    if (commentId !== undefined) {
        axios.delete(`posts/${slug.value}/comments/${commentId}`, {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(() => {
            console.log('Comment deleted');
            refresh();

        }).catch((error) => {
            console.error(error);
        });
    }
};

const addComment = () => {
    popUpMessage.value = "Add a new comment";
    popUpInput.value = '';
    currentCommentIndex.value = null;
    commentMode.value = 'create';
    isPopUpVisible.value = true;
};

const handleSaveComment = () => {
    const content = popUpInput.value;
    if (currentCommentIndex.value !== null) {
        saveComment({ id: blogPost.value?.comments?.[currentCommentIndex.value].id, content });
    } else {
        saveComment({ content });
    }
};

onMounted(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);

    slug.value = route.params.slug as string;

    importBlog(slug.value).then((data) => {
        blogPost.value = data;
    });
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    commentsPosition.value = {
        top: windowHeight - maxHeight.value - 90,
        left: windowWidth - 340,
    };
});

onUnmounted(() => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
    <main>
        <section class="content">
            <div class="header-wrapper">
                <h1>{{ blogPost?.title }}</h1>
                <div class="content-header">
                    <div class="content-header-items">
                        <span>By {{ blogPost?.user?.name }}</span>
                        <span>Published: {{ blogPost?.created_at?.split('T')[0] }}</span>
                        <span>Last Edited: {{ blogPost?.updated_at?.split('T')[0] }}</span>
                    </div>
                    <div v-if="blogPost?.editMode" class="action-icons">
                        <div @click="editBlog(blogPost?.slug)" class="edit-icon" title="Edit Blog">
                            <EditIcon />
                        </div>
                        <div @click="deleteBlog(blogPost?.slug)" class="delete-icon" title="Delete Blog">
                            <DeleteIcon />
                        </div>
                    </div>
                </div>
            </div>
            <article>
                <p>{{ blogPost?.content }}</p>
            </article>
        </section>

        <div class="comments-icon" @click="toggleComments" title="Show/Hide Comments">
            💬
        </div>

        <aside v-if="showComments" class="comments"
            :style="{ top: commentsPosition.top + 'px', left: commentsPosition.left + 'px', maxHeight: maxHeight + 'px' }"
            @mousedown="startDrag">
            <div class="comments-header">
                <h2>Comments</h2>
                <button @click="addComment">Add Comment</button>
            </div>
            <ul>
                <li v-for="(comment, index) in blogPost?.comments" :key="index" class="comment-item">
                    <div class="comment-content">
                        <strong>{{ comment.user?.name }}:</strong> {{ comment.content }}
                        <div class="comment-actions" v-if="userId === comment.user?.id">
                            <EditIcon @click="editComment(index)" />
                            <DeleteIcon @click="deleteComment(index)" />
                        </div>
                    </div>
                </li>
            </ul>
        </aside>

        <PopUp :message="popUpMessage" :isInput="true" :visible="isPopUpVisible" :modelValue="popUpInput"
            :mode="commentMode" @update:visible="isPopUpVisible = $event" @update:modelValue="popUpInput = $event"
            @save="handleSaveComment" :commentId="commentId" />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    margin: 20px auto;
}

.header-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.content-header {
    min-width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
    position: relative;
}

.content-header-items {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-right: 1em;
    width: fit-content;
}

.action-icons {
    display: flex;
    gap: 10px;
    position: absolute;
    top: -20px;
    right: -10px;
}

.edit-icon,
.delete-icon {
    cursor: pointer;
    font-size: 20px;
    transition: transform 0.3s;
}

.edit-icon:hover,
.delete-icon:hover {
    transform: scale(1.2);
}

.content {
    width: 100%;
    margin-bottom: 20px;
}

h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 10px;
    overflow-wrap: break-word;
    /* Ensures long words or URLs break to fit the container */
    word-break: break-word;
}

article p {
    margin-top: 2em;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #444;
}

.comments-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    z-index: 1000;
    background-color: #444140;
    color: #fff;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
}

.comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #fff;
    padding: 10px 10px;
    border-bottom: 1px solid #ddd;
    z-index: 10;
}

.comments-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
}

.comments-header button {
    background-color: #EF2D56;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
}

.comments-header button:hover {
    background-color: #d32449;
}


.comments-icon:hover {
    background-color: #EF2D56;
}

.comments {
    position: fixed;
    width: 320px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: auto;
    z-index: 1000;
    cursor: grab;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: 8px;
}

.comments h2 {
    margin-top: 0;
    font-size: 1.2rem;
    color: #333;
}

.comments ul {
    list-style-type: none;
    padding-left: 0;
}

.comments li {
    margin-bottom: 10px;
    font-size: 1rem;
    color: #555;
}

.comments li strong {
    color: #333;
}

.comment-item {
    position: relative;
    padding-right: 40px;
    margin-bottom: 10px;
}


.comment-actions {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    gap: 8px;
}

.comment-item:hover .comment-actions {
    display: flex;
}

.comment-actions svg {
    width: 25px;
    height: 25px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.comment-actions svg:hover {
    transform: scale(1.2);
}
</style>
