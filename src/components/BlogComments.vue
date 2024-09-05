<script setup lang="ts">
import { ref } from 'vue';
import { API_URL } from '@/util/constants';
import type { COMMENT } from '@/util/types/types';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import PopUp from '@/components/PopUp.vue';
import axios from 'axios';

const props = defineProps<{
  comments: COMMENT[] | undefined;
  userId: number;
  slug: string;
  isBlogPoster: boolean
}>();
const emit = defineEmits<{ (e: 'refresh'): void; (e: 'close-sidebar'): void }>();

const isPopUpVisible = ref(false);
const popUpMessage = ref('Edit your comment');
const popUpInput = ref<string>('');
const currentCommentIndex = ref<number | null>(null);
const commentId = ref<number>(0);
const commentMode = ref<'create' | 'edit'>('create');

const addComment = () => {

  popUpMessage.value = "Add your comment";
  popUpInput.value = '';

  commentMode.value = 'create';

  isPopUpVisible.value = true;

};

const editComment = (index: number) => {

  popUpMessage.value = "Edit your comment";
  popUpInput.value = props.comments?.[index].content || '';

  commentId.value = props.comments?.[index].id || 0;
  commentMode.value = 'edit';
  currentCommentIndex.value = index;

  isPopUpVisible.value = true;

};

const deleteComment = (index: number) => {

  const commentId = props.comments?.[index].id;

  if (commentId !== undefined) {

    axios.delete(`posts/${props.slug}/comments/${commentId}`, {
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(() => {
      emit('refresh');

    }).catch((error) => {
      console.error(error);

    });
  }
};

const handleSaveComment = () => {

  const content = popUpInput.value;

  if (currentCommentIndex.value !== null && commentMode.value === 'edit') {
    saveComment({ id: props.comments?.[currentCommentIndex.value].id, content });

  } else {
    saveComment({ content });

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

  axios.post(`/posts/${props.slug}/comments`, { content }, {
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then(() => {
    emit('refresh');


  }).catch((error) => {
    console.error(error);

  });
};

const updateCommentToApi = (comment: { id?: number; content: string }) => {

  axios.put(`/posts/${props.slug}/comments/${comment.id}`, { content: comment.content }, {
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then(() => {
    emit('refresh');

  }).catch((error) => {
    console.error(error);

  });
};
</script>
<template>
  <aside class="comments-sidebar">


    <div class="comments-header">

      <h2>Comments</h2>
      
      <div class="header-buttons">
        <button @click="emit('close-sidebar')" class="close-btn">✖</button>
      </div>
    
    </div>
    
    <div class="add-comment">
      <button @click="addComment" class="add-comment-btn">Add Comment</button>
    </div>
    
    <ul class="comments-body">
      <li v-for="(comment, index) in props.comments" :key="comment.id" class="comment-item">
        <div class="comment-content">
          <strong>{{ comment.user?.name }}:</strong> {{ comment.content }}
          <div class="comment-actions">
            <EditIcon v-if="props.userId === comment.user?.id" @click="editComment(index)" />
            <DeleteIcon v-if="props.userId === comment.user?.id || isBlogPoster" @click="deleteComment(index)" />
          </div>
        </div>
      </li>
    </ul>
  
  
  </aside>

  <PopUp :message="popUpMessage" :isInput="true" :visible="isPopUpVisible" :modelValue="popUpInput" :mode="commentMode"
    @update:visible="isPopUpVisible = $event" @update:modelValue="popUpInput = $event" @save="handleSaveComment"
    :commentId="commentId" />
    
</template>


<style scoped>
.comments-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 320px;
  height: 100vh;
  background-color: #fff;
  border-left: 1px solid #ddd;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  transition: transform 0.3s ease-in-out;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.add-comment {
  margin-top: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-comment-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.add-comment-btn:hover {
  background-color: #45a049;
}

.comments-header .close-btn {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.comments-header .close-btn:hover {
  color: #EF2D56;
}

.comments-body {

  list-style: none;
  padding: 0;
}

.comments li {
  font-size: 1rem;
  color: #555;
}

.comments li strong {
  color: #333;
}

.comment-item {
  position: relative;
}

.comment-content {
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  position: relative;
}

.comment-actions {
  position: absolute;
  bottom: -1.25em;
  right: 0;
  gap: 8px;
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