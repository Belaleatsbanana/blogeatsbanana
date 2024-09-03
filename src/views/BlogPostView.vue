<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import router from '@/router';
import BlogComments from '@/components/BlogComments.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import HeartIcon from '@/components/icons/HeartIcon.vue';
import { API_URL } from '@/util/constants';
import { importBlog, likeBlog } from '@/util/methods';
import type { BLOG } from '@/util/types/types';
import defaultImage from "@/assets/BananaBlog.png";
import Popup from '@/components/PopUp.vue';

const imgSrc = ref<string>(defaultImage);
const route = useRoute();
const slug = ref<string>('');
const blogPost = ref<BLOG | null>(null);
const userId = parseInt(localStorage.getItem('userId') as string, 10);
const showComments = ref(false);
const likeAnimation = ref<string | null>(null);
const likeAction = ref<string | null>(null);
const isBlogPoster = ref<boolean>();

const likeHeaderMessage = ref('');
const likePopupVisible = ref(false);

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

const fetchBlogPost = async () => {
  try {
    blogPost.value = await importBlog(slug.value as string);
    isBlogPoster.value = userId === blogPost.value?.user?.id;

  } catch (error) {
    console.error(error);
    alert("Error fetching the blog post.");
  }
};

const editBlog = (slug?: string) => {
  if (slug) router.push({ name: "EditPost", params: { slug } });
};

const deleteBlog = async (slug?: string) => {
  if (slug) {
    try {
      await apiRequest('delete', `/posts/${slug}`);
      router.push({ name: "Home" });
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the blog post. Please try again.");
    }
  }
};

const refresh = () => {
  fetchBlogPost();
};

const toggleLikeBlog = (slug: string) => {

    if (likeAnimation.value) return;

    const blog = blogPost.value;

    if (blog) {
        likeAnimation.value = slug;
        likeAction.value = blog.liked_by_user ? 'unliking' : 'liking';

        blog.liked_by_user = !blog.liked_by_user;
        blog.likes_count = (blog.likes_count ?? 0) + (blog.liked_by_user ? 1 : -1);
        setTimeout(() => {

            likeAnimation.value = null;
            likeAction.value = null;

            likeBlog(slug).then((result) => {

                if(result)
                    {console.log(result);
                      fetchBlogPost();
                    }
                else
                    blog.liked_by_user = !blog.liked_by_user;

            }).catch(() => {
                blog.liked_by_user = !blog.liked_by_user;
            });

        }, 1000); 
    }
};

onMounted(() => {
  slug.value = route.params.slug as string;
  fetchBlogPost();
  
});

const openLikes = () => {
  const likes = blogPost.value?.likes;
  console.log(likes);
  
  if (likes?.length) {
    console.log(likes[0].name);
    
    likeHeaderMessage.value = 'Likes';
     likePopupVisible.value = true;
  }else {
    likeHeaderMessage.value = 'No likes yet';
    likePopupVisible.value = true;
  }
};


</script>



<template>
  <main>
    <section class="content">
      <img :src="blogPost?.image ? blogPost.image : imgSrc" alt="Blog Image" class="post-image" />
      <div class="header-wrapper">
        <h1>{{ blogPost?.title }}</h1>
        <div class="content-header">
          <div class="in-liner">
            <div class="blog-like" @click="openLikes">
              <HeartIcon :fillColor="blogPost?.liked_by_user ? 'red' : 'white'"
                :strokeColor="blogPost?.liked_by_user ? 'red' : 'black'"
                @click.stop="toggleLikeBlog(blogPost?.slug as string)"
                :class="likeAction === 'liking' && likeAnimation === blogPost?.slug ? 'liking' : likeAction === 'unliking' && likeAnimation === blogPost?.slug ? 'unliking' : ''"
                class="heart-icon" />
              <span>{{ blogPost?.likes_count }} Likes</span>
            </div>
            <div v-if="blogPost?.user?.id === userId" class="action-icons">
              <div @click="editBlog(blogPost?.slug)" class="edit-icon" title="Edit Blog">
                <EditIcon />
              </div>
              <div @click="deleteBlog(blogPost?.slug)" class="delete-icon" title="Delete Blog">
                <DeleteIcon />
              </div>
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
    <BlogComments v-if="showComments" :comments="blogPost?.comments" :userId="userId" :slug="blogPost?.slug as string"
      :isBlogPoster="isBlogPoster as boolean" @refresh="refresh" @close-sidebar="closeComments" />
  </main>
  <Popup :visible="likePopupVisible" :message="likeHeaderMessage" :likes="blogPost?.likes"
    @update:visible="likePopupVisible = $event" />
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

.in-liner {
  display: flex;
  gap: 10px;
}

.blog-like {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.3s, background-color 0.3s;
  padding: 10px 10px;
  border-radius: 1em;
}

.blog-like:hover {
  transform: scale(1.1);
  background-color: var(--color-background-1);
}

.heart-icon {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, color 0.3s ease;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.heart-icon.liking {
  animation: bounce 0.6s ease;
}

.heart-icon.unliking {
  animation: shrink 0.6s ease;
}

@keyframes bounce {
  0% {
    transform: scale(1);
  }

  20% {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1.2);
  }

  70% {
    transform: scale(1.35);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes shrink {
  0% {
    transform: scale(1.35);
  }

  100% {
    transform: scale(1);
  }
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
  display: flex;
  align-items: center;
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
