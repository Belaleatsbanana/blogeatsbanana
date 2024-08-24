<script setup lang="ts">
import ListBlogs from '@/components/ListBlogs.vue';
import { importBlogs } from '@/util/methods';
import type { BLOG } from '@/util/types/types';
import { onMounted, ref } from 'vue';

const Blogs = ref<BLOG[]>([]);
const userId = parseInt(localStorage.getItem('userId') as string);

onMounted(async () => {
    Blogs.value = await importBlogs();

    Blogs.value = Blogs.value.map((blog) => {
        if (blog.user?.id === userId) {
            blog.editMode = true;
        } else {
            blog.editMode = false;
        }
        return blog;
    });
    console.log(Blogs.value);
});
</script>

<template>
    <main class="display-home">
        <section class="home-body">
            <h1>Featured Blogs</h1>
            <ListBlogs :blogs="Blogs" />

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