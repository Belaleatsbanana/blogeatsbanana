import { ref } from "vue"

export type USER = {
  id?: number
  email?: string
  name?: string
  password?: string
  password_confirmation?: string
}

export type BLOG = {
    id?: number
    slug?: string
    title?: string
    content?: string
    comments_count?: number
    created_at?: string
    created_at_readable?: string
    updated_at?: string
    updated_at_readable?: string
    image?: string
    image_thumb?: string
    user?: USER
    last_comment?: COMMENT
    comments?: COMMENT[]
    editMode?: boolean
}

export const BLOGS = ref<{apiResponse : POSTS_RESPONSE, page : number}>()

export type COMMENT = {
  id?: number
  content?: string
  created_at?: string
  created_at_readable?: string
  user?: USER
}

export type LINKS = {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}
export type META_LINKS = {
  url : string
  label : string
  active : boolean
}[]

export type META = {
  current_page: number
  from: number
  last_page: number
  links: META_LINKS
  path: string
  per_page: number
  to: number
  total: number
} 


export type POSTS_RESPONSE = {
  data: BLOG[]
  links: LINKS
  meta: META
}

function ComputedRef<T>() {
  throw new Error("Function not implemented.")
}
