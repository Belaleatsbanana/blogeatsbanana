<script setup lang="ts">
import { ref } from 'vue';
import { API_URL, ROUTES } from '@/util/constants';
import type { USER } from '@/util/types/types';
import eyeIcon from '@/components/icons/eyeIcon.vue';
import eyeOffIcon from '@/components/icons/eyeOffIcon.vue';
import axios from 'axios';
import router from '@/router';


const email = ref('');
const password = ref('');
const showPassword = ref(false);

const unprocessedLogin = ref('');
const unprocessedEmail = ref('');
const unprocessedPassword = ref('');

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleLogin = () => {

    unprocessedLogin.value = '';
    unprocessedEmail.value = '';
    unprocessedPassword.value = '';

    const user: USER = {
        email: email.value,
        password: password.value,
    };

    axios.post("/login", user,
        {
            baseURL: API_URL,
        }
    ).then((response) => {
        localStorage.setItem('token', response.data.token);

        const lastRoute = localStorage.getItem('lastRoute');
        if (lastRoute) {
            localStorage.removeItem('lastRoute');
            router.push(lastRoute);
        } else {
            router.push(ROUTES.HOME);
        }
    }).catch((err) => {
        if (err.response.status === 422) {
            if (err.response.data.errors.email) {
                unprocessedEmail.value = err.response.data.errors.email[0];
            }
            if (err.response.data.errors.password) {
                unprocessedPassword.value = err.response.data.errors.password[0];
            }

        }
    });
};
</script>

<template>


    <main>

        <div class="welcome-container">

            <img src="../assets/blog.jpg" alt="logo" />
            <h1>Welcome Back to BananaBlog!</h1>
            <p class="welcome-message">Sign in to continue sharing your experiences and creativity with the world.</p>

            <div class="signup-alignment">
                <p>Don't have an account?</p>
                <router-link to="/register">
                    <button class="signup-button">Create Account</button>
                </router-link>
            </div> <!-- Sign up Action -->

        </div> <!-- Welcome Container -->

        <div class="login-container">

            <h2>Login</h2>
            <p v-if="unprocessedLogin">{{ unprocessedLogin }}</p>
            <form class="login-form" @submit.prevent>

                <div class="input-group">
                    <span class="unprocessed" v-if="unprocessedEmail">{{ unprocessedEmail }}</span>
                    <input type="email" placeholder="Enter Your Email" v-model="email" />
                </div> <!-- Email Input Group -->

                <div class="input-group password-group">

                    <span class="unprocessed" v-if="unprocessedPassword">{{ unprocessedPassword }}</span>

                    <div class="password-input">
                        <input :type="showPassword ? 'text' : 'password'" placeholder="Enter Your Password"
                            v-model="password" />
                        <span class="toggle-password" @click="togglePassword">
                            <component :is="showPassword ? eyeIcon : eyeOffIcon" />
                        </span>
                    </div> <!-- Password Input -->

                </div> <!-- Password Input Group -->

                <button type="submit" class="login-button" @click="handleLogin">Login</button>
            </form>

        </div> <!-- Login Container -->

    </main>


</template>

<style scoped>
.unprocessed {
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
}

.password-input {
    position: relative;
}

main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--color-background-1);
}

.welcome-container {
    width: 40%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    background-color: var(--color-background-3);
}

.welcome-message {
    margin-top: 20px;
    width: 80%;
    font-size: 1em;
    color: var(--color-text-1);
    margin-bottom: 20px;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-background-1);
    padding: 40px;
    border-radius: 15px;
    margin: auto;
    text-align: center;
    width: 40%;
}

h2 {
    font-size: 24px;
    color: var(--color-text-1);
    margin-bottom: 20px;
}

.login-form {
    width: 100%;
}

.input-group {
    position: relative;
    margin-bottom: 20px;
    text-align: left;
}

input {
    width: 100%;
    height: 50px;
    padding: 30px 15px;
    border-radius: 15px;
    border: 1px solid var(--color-background-1);
    color: var(--color-text-1);
    background-color: var(--color-background-1);
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

input::placeholder {
    font-family: 'Poppins', sans-serif;
    text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1);
    font-weight: 500;
    color: var(--color-text-1);
}

input:active,
input:focus {
    border-color: var(--color-background-2);
}

.password-group input {
    padding-right: 40px;
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
}

.login-button {
    width: 60%;
    height: 50px;
    padding: 10px 15px;
    border-radius: 15px;
    background-color: var(--color-background-1);
    border: none;
    color: var(--color-text-1);
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

.login-button:hover {
    background-color: #b8d0f6;
}

.signup-alignment {
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.signup-button {
    height: 50px;
    padding: 10px 15px;
    border-radius: 15px;
    background-color: var(--color-background-1);
    border: none;
    color: var(--color-text-1);
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

.signup-button:hover {
    background-color: #b8d0f6;
}
</style>
