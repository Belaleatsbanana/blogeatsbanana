import axios from 'axios'
import { API_URL } from './constants'
import type { BLOG, POSTS_RESPONSE, USER } from './types/types'

const nullUser: USER = {
  id: 0,
  name: 'Default',
  email: '',
  password: ''
}

export const importUser = async (): Promise<USER> => {
  try {
    const response = await axios.get('/user', {
      baseURL: API_URL,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    return response.data as USER
  } catch (err) {
    console.error(err)
    return nullUser
  }
}

export const importBlogs = async (page = `${API_URL}/posts?page=1`): Promise<POSTS_RESPONSE | null> => {
  try {
    const response = await axios.get(`${page}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    return response.data
  } catch (err) {
    console.error(err)
    return null
  }
}

export const importBlog = async (slug: string): Promise<BLOG> => {
  try {
    const response = await axios.get(`/posts/${slug}`, {
      baseURL: API_URL,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    return response.data.data as BLOG
  } catch (err) {
    console.error(err)
    return {
      title: 'Default',
      content: 'Default'
    }
  }
}
