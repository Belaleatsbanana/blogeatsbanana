<script setup lang="ts">
import ListBlogs from '@/components/ListBlogs.vue';
import PaginationBar from '@/components/PaginationBar.vue';
import { API_URL } from '@/util/constants';
import { importBlogs } from '@/util/methods';
import type { BLOG, POSTS_RESPONSE } from '@/util/types/types';
import { BLOGS } from '@/util/types/types';
import { onMounted, ref } from 'vue';

const ApiResponse   = ref<POSTS_RESPONSE>();
const Blogs         = ref<BLOG[]>([]);
const isLoading     = ref(true);
const selectedSort  = ref('desc');

onMounted(async () => {

    if (localStorage.getItem('page')) {
        isLoading.value = true;

        ApiResponse.value = await importBlogs(`${API_URL}/posts?page=${BLOGS.value?.page}&sort=${selectedSort.value}`) as POSTS_RESPONSE;

        Blogs.value = ApiResponse.value.data as BLOG[];
        BLOGS.value = { apiResponse: ApiResponse.value, page: parseInt(localStorage.getItem('page') as string) };

        isLoading.value = false;
        return;
    }
    if (BLOGS.value?.page) {
        Blogs.value = BLOGS.value.apiResponse.data;

    } else {
        try {
            ApiResponse.value = await importBlogs() as POSTS_RESPONSE;

            Blogs.value = ApiResponse.value.data as BLOG[];
            BLOGS.value = { apiResponse: ApiResponse.value, page: 1 };

        } catch (error) {
            console.error('Error fetching blogs:', error);

        } finally {
            isLoading.value = false;
        }
    }
});


const setPage = async (pageUrl: string | null) => {

    if (pageUrl) {

        const pageNo = parseInt(pageUrl.split('page=')[1]);

        try {
            ApiResponse.value = await importBlogs(pageUrl) as POSTS_RESPONSE;
            Blogs.value = ApiResponse.value.data as BLOG[];
            BLOGS.value = { apiResponse: ApiResponse.value, page: pageNo };
            localStorage.setItem('page', pageNo.toString())

        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            isLoading.value = false;
        }

    }
};

const onSortChange = async () => {
    isLoading.value = true;
    try {
        ApiResponse.value = await importBlogs(`${API_URL}/posts?page=${BLOGS.value?.page}&sort=${selectedSort.value}`) as POSTS_RESPONSE;
        Blogs.value = ApiResponse.value.data as BLOG[];
        BLOGS.value = { apiResponse: ApiResponse.value, page: parseInt(localStorage.getItem('page') as string) };
        
    }
    catch (error) {
        console.error('Error fetching blogs:', error);
    } finally {
        isLoading.value = false;
    }
};

</script>

<template>
    <main class="display-home">

        <section class="home-body">

            <div class="home-header">
                <h1>Featured Blogs</h1>
                <select name="sort" id="sort" v-model="selectedSort" @change="onSortChange">
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>

            <ListBlogs :blogs="Blogs" />

        </section>

        <footer v-if="!isLoading">
            <PaginationBar :links="ApiResponse?.links" :meta_links="ApiResponse?.meta.links" @pageChange="setPage" />
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

select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--color-text-1);
    background-color: var(--color-background-1);
    color: var(--color-text-1);
    font-size: 1rem;
    cursor: pointer;
}

.display-home {
    display: flex;
    flex-direction: column;
}

.home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    width: 100%;
    background-color: var(--color-background-1);
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