<script setup lang="ts">
import ListBlogs from '@/components/ListBlogs.vue';
import { API_URL } from '@/util/constants';
import { type BLOG, type POSTS_RESPONSE } from '@/util/types/types';
import axios from 'axios';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import PaginationBar from '@/components/PaginationBar.vue';
import { importBlogs } from '@/util/methods';

const filteredBlogs = ref<BLOG[]>([]);
const route = useRoute();

const loadingQuery = ref(false)
const ApiResponse = ref<POSTS_RESPONSE>();


onMounted(() => {
    loadingQuery.value = true

    window.addEventListener('beforeunload', saveData)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', saveData);
})

const saveData = () => {
    
    localStorage.setItem('searchPageNo', ApiResponse.value?.meta.current_page.toString() as string);
}

const searchQueryResult = async (query: string): Promise<POSTS_RESPONSE> => {

    const pageNo = localStorage.getItem('searchPageNo') || 1;
    console.log('pageNo', pageNo);
    
    return await axios.get(`/posts/?page=${pageNo}&search=${query}`, {
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        console.log(err);
        return [];
    })
}



const setPage = async (pageUrl: string | null) => {
    console.log(pageUrl);

    if (pageUrl) {
        pageUrl += `&search=${route.query.q}`

        console.log('man ', pageUrl);
        try {
            ApiResponse.value = await importBlogs(pageUrl) as POSTS_RESPONSE;
            filteredBlogs.value = ApiResponse.value.data as BLOG[];

        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            loadingQuery.value = false;
        }

    }
};

watch(() => route.query.q?.toString(), (newQuery) => {
    console.log(newQuery);
    loadingQuery.value = true
    searchQueryResult(newQuery as string).then((response) => {
        
        ApiResponse.value = response;
        filteredBlogs.value = response.data;
        console.log(filteredBlogs.value);
        
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        loadingQuery.value = false;
        localStorage.removeItem('searchPageNo');
    })

}, { immediate: true });


</script>

<template>
    <main class="display-home" v-if="!loadingQuery">
        <section class="home-body">
            <h1>Search Results for {{route.query.q}}</h1>
            <ListBlogs :blogs="filteredBlogs" />

        </section>
        <footer v-if="!loadingQuery">
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
</style>