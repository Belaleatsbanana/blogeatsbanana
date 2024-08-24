<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSignUp = () => {
    router.push('/register');
};

const handleLogin = () => {
    router.push('/login');
};
</script>

<template>
    <main>
        <h1>Landing Page</h1>
        <button @click="handleSignUp">Sign up</button>
        <button @click="handleLogin">Log in</button>
    </main>
</template>

<style scoped></style>