import axios from 'axios'
import { API_URL } from './constants'
import type { BLOG, POSTS_RESPONSE, USER } from './types/types'


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})

// const debounce = (func: Function, wait: number) => {
//   let timeout: ReturnType<typeof setTimeout>;
//   return function(...args: any[]) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// const throttle = (func: Function, limit: number) => {
//   let inThrottle: boolean;
//   return function(...args: any[]) {
//     if (!inThrottle) {
//       func(...args);
//       inThrottle = true;
//       setTimeout(() => (inThrottle = false), limit);
//     }
//   };
// };

const nullUser: USER = {
  id: 0,
  name: 'Default',
  email: '',
  password: ''
}


export const importUser = async (): Promise<USER> => {
  return await apiClient
    .get('/user')
    .then((response) => {
      return response.data as USER
    })
    .catch((err) => {
      console.error(err)
      return nullUser
    })
}


export const importBlogs = async (page = '/posts?page=1'): Promise<POSTS_RESPONSE | null> => {
  return await apiClient
    .get(page)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error(err)
      return null
    })
}


export const importBlog = async (slug: string): Promise<BLOG> => {
  return await apiClient
    .get(`/posts/${slug}`)
    .then((response) => {
      return response.data.data as BLOG
    })
    .catch((err) => {
      console.error(err)
      return {
        title: 'Default',
        content: 'Default'
      }
    })
}


export const likeBlog = async (slug: string): Promise<boolean> => {

  return await apiClient
    .post(`/posts/like/${slug}`, {})
    .then((response) => {

      console.log(response.data);
      return true
    })
    .catch((err) => {

      console.error(err)
      return false
    })
}


