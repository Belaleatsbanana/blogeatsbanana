<script setup lang="ts">
import ListBlogs from '@/components/ListBlogs.vue';
import { API_URL } from '@/util/constants';
import { type BLOG, type POSTS_RESPONSE } from '@/util/types/types';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const filteredBlogs = ref<BLOG[]>([]);
const route = useRoute();

const loadingQuery = ref(false)


onMounted(() => {
    loadingQuery.value = true
})

const searchQueryResult = async (query: string): Promise<POSTS_RESPONSE> => {
    return await axios.get(`/posts/?search=${query}`, {
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then((response) => {
        loadingQuery.value = false;
        return response.data;
    }).catch((err) => {
        console.log(err);
        loadingQuery.value = false;
        return [];
    })
}



watch(() => route.query.q?.toString(), (newQuery) => {
    console.log(newQuery);
    loadingQuery.value = true
    searchQueryResult(newQuery as string).then((response) => {
        filteredBlogs.value = response.data;
        console.log(filteredBlogs.value);
        
    }).catch((err) => {
        console.log(err);
    });

}, { immediate: true });


</script>

<template>
    <main class="display-home" v-if="!loadingQuery">
        <section class="home-body">
            <h1>Search Results for {{route.query.q}}</h1>
            <ListBlogs :blogs="filteredBlogs" />
            
        </section>

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