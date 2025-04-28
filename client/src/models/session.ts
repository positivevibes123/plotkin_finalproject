import { ref } from 'vue'
import * as myFetch from '../models/myfetch'
import { type User, get } from '../models/users'

export function api<T>(url: string, data?: any, method?: string): Promise<T> {
  return myFetch.api<T>(url, data, method)
}

const session = ref({
  user: null as User | null,
  token: null as string | null,
})

export function refSession() {
  return session
}

export const isAdmin = () => session.value?.user?.isadmin

export const isLoggedIn = () => session.value?.user !== null

/*export function login(id: number) {
  return get(id).then((user) => {
    session.value.user = user
  })
}*/

export function login(id: number) {
  get(id).then((user) => {
    console.log('Retrieved user from login:', user.data)
    session.value.user = user.data
  })
}
export function logout() {
  session.value.user = null
  session.value.token = null
}