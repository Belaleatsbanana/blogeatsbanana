<script setup lang="ts">

import { onMounted, ref } from 'vue';
import DownArrowIcon from '@/components/icons/DownArrowIcon.vue';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import RightArrowIcon from '@/components/icons/RightArrowIcon.vue';
import { importUser } from '@/util/methods';
import type { USER } from '@/util/types/types';
import router from '@/router';

const userInfo = ref<USER>({
    id: 0,
    name: '',
});

const searchQuery = ref('');

onMounted(async () => {
    const user = await importUser();
    if (user.id) {
        userInfo.value = user;
        localStorage.setItem('userId', user.id.toString());
    } else {
        console.log('Failed to fetch user information.');
    }
});
const isDropdownVisible = ref(false);

const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
};

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ name: 'SearchResults', query: { q: searchQuery.value.trim() } });
    }
};

</script>

<template>
    <header class="blog-header">
        <div class="search-bar">
            <input v-model="searchQuery" placeholder="Search for blogs" />
            <button @click="handleSearch">Search</button>
        </div>
        <h1>BananaBlog</h1>
        <div class="profile-section" @click="toggleDropdown">
            <ProfileIcon />
            <span class="username">{{ userInfo.name }}</span>
            <DownArrowIcon v-show="isDropdownVisible" />
            <RightArrowIcon v-show="!isDropdownVisible" />
            <div v-if="isDropdownVisible" class="dropdown-menu">
                <ul>
                    <li><router-link to="/login" @click="logout">Logout</router-link></li>
                </ul>
            </div>
        </div>
    </header>
</template>

<style scoped>
.blog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    width: 100%;
    background-color: var(--color-background-1);
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-bar input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 200px;
    transition: border-color 0.3s;
}

.search-bar input:focus {
    outline: none;
    border-color: var(--color-primary);
}

.search-bar button {
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: var(--color-background-2);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.search-bar button:hover {
    color: var(--color-text-1);
    background-color: var(--color-background-3);
    border-color: var(--color-background-2);
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    padding: 0.5rem 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    border-radius: 8px;
}

.profile-section:hover {
    background-color: var(--color-muted);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.username {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-1);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--color-background-3);
    border: 1px solid #ccc;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 100;
}

.dropdown-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.dropdown-menu li {
    margin: 5px 0;
}

.dropdown-menu li a {
    text-decoration: none;
    color: var(--color-text-1);
}

.dropdown-menu li a:hover {
    color: var(--color-background-2);
}
</style>