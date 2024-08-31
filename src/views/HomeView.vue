<script setup lang="ts">
import ListBlogs from '@/components/ListBlogs.vue';
import PaginationBar from '@/components/PaginationBar.vue';
import { importBlogs } from '@/util/methods';
import type { BLOG, POSTS_RESPONSE } from '@/util/types/types';
import { onMounted, ref } from 'vue';

const ApiResponse = ref<POSTS_RESPONSE>();
const Blogs = ref<BLOG[]>([]);
const isLoading = ref(true);

onMounted(async () => {
    
    try {
        ApiResponse.value = await importBlogs() as POSTS_RESPONSE;
        Blogs.value = ApiResponse.value.data as BLOG[];
    } catch (error) {
        console.error('Error fetching blogs:', error);
    } finally {
        isLoading.value = false;
    }
});

// const userId = parseInt(localStorage.getItem('userId') as string);

const setPage = (pageUrl: string | null) => {
    console.log(pageUrl);
    
    if (pageUrl) {
        console.log('man ', pageUrl);
        importBlogs(pageUrl).then((response) => {
            ApiResponse.value = response as POSTS_RESPONSE;
            Blogs.value = ApiResponse.value.data;
        });
        Blogs.value = ApiResponse.value?.data as BLOG[];
    }
};
</script>

<template>
    <main class="display-home">
        <section class="home-body">
            <h1>Featured Blogs</h1>
            <ListBlogs :blogs="Blogs" />

        </section>
        <footer v-if="!isLoading">
            <PaginationBar :links="ApiResponse?.links" 
            :meta_links="ApiResponse?.meta.links" 
            @pageChange="setPage"
            />
            
        </footer>
    </main>

</template>

<style scoped>
h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

h2 {
    font-size: 1.25rem;
    font-weight: 600;
}

p {
    font-size: 0.75rem;
    font-weight: 400;
}

.display-home {
    display: flex;

    flex-direction: column;
}



.home-body {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    width: 100%;
    background-color: var(--color-background-1);
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3em;
}
</style>