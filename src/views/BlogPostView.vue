<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import router from '@/router';
import BlogComments from '@/components/BlogComments.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import { API_URL } from '@/util/constants';
import { importBlog } from '@/util/methods';
import type { BLOG } from '@/util/types/types';
import defaultImage from "@/assets/BananaBlog.png";

const imgSrc = ref<string>(defaultImage);
const route = useRoute();
const slug = ref<string>('');
const blogPost = ref<BLOG>();
const userId = parseInt(localStorage.getItem('userId') as string);
const showComments = ref(false);

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const closeComments = () => {
  showComments.value = false;
};

const apiRequest = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) => {
  return axios({
    method,
    url,
    data,
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

const fetchBlogPost = () => {
  importBlog(slug.value as string).then((result) => {
    blogPost.value = result;
  }).catch((error) => {
    console.error(error);
    alert("Error fetching the blog post.");
  });
};

const editBlog = (slug?: string) => {
  if (slug) {
    router.push({ name: "EditPost", params: { slug } });
  }
};

const deleteBlog = (slug?: string) => {
  if (slug) {
    apiRequest('delete', `/posts/${slug}`)
      .then(() => {
        router.push({ name: "Home" });
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while deleting the blog post. Please try again.");
      });
  }
};

const refresh = () => {
  fetchBlogPost();
};

onMounted(() => {
  slug.value = route.params.slug as string;
  fetchBlogPost();
});
</script>


<template>
    <main>
      <section class="content">
        <img :src="blogPost?.image ? blogPost.image : imgSrc" alt="Blog Image" class="post-image" />
        <div class="header-wrapper">
          <h1>{{ blogPost?.title }}</h1>
          <div class="content-header">
            <div v-if="blogPost?.user?.id === userId" class="action-icons">
              <div @click="editBlog(blogPost?.slug)" class="edit-icon" title="Edit Blog">
                <EditIcon />
              </div>
              <div @click="deleteBlog(blogPost?.slug)" class="delete-icon" title="Delete Blog">
                <DeleteIcon />
              </div>
            </div>
            <div class="content-header-items">
              <span>By {{ blogPost?.user?.name }}</span>
              <span>Published: {{ blogPost?.created_at?.split('T')[0] }}</span>
              <span>Last Edited: {{ blogPost?.updated_at?.split('T')[0] }}</span>
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
      <BlogComments 
        v-if="showComments" 
        :comments="blogPost?.comments" 
        :userId="userId" 
        :slug="blogPost?.slug as string"
        @refresh="refresh" 
        @close-sidebar="closeComments" 
      />
    </main>
  </template>
  
  
  <style scoped>
  main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      max-width: 1100px;
      margin: 0 auto;
  }
  
  .post-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 4px;
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
      padding: 0.5em;
      display: flex;
      gap: 10px;
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
  </style>
  