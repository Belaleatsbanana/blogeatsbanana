import axios from 'axios'
import { API_URL } from './constants'
import type { BLOG, USER } from './types/types'

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

export const importBlogs = async (): Promise<BLOG[]> => {
  try {
    const response = await axios.get('/posts', {
      baseURL: API_URL,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    return response.data as BLOG[]
  } catch (err) {
    console.error(err)
    return []
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

    return response.data as BLOG
  } catch (err) {
    console.error(err)
    return {
      title: 'Default',
      content: 'Default'
    }
  }
}
