export type USER = {
  id?: number
  email?: string
  name?: string
  password?: string
  password_confirmation?: string
}

export type BLOG = {
  id?: number
  title: string
  slug?: string
  content: string
  is_published?: boolean
  created_at?: string
  updated_at?: string
  comments_count?: number
  user?: USER
  comments?: COMMENT[]
  editMode?: boolean
}

export type COMMENT = {
  id?: number
  content: string
  user?: USER
  editMode?: boolean
}
