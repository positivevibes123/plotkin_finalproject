import { ref } from 'vue'
import * as myFetch from '../models/myfetch'
import { type User, get } from '../models/users'
import { login } from '../models/users'

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

export function loginWithID(id: number) {
  get(id).then((user) => {
    const retrievedUser = (user.data as unknown as Array<any>)[0]
    console.log('User logged in:', retrievedUser.userid)
    session.value.user = retrievedUser
  })
}

export function loginWithCredentials(username: string, password: string) {
  login(username, password).then((user) => {
    const retrievedUser = (user.data as unknown as Array<any>)[0]
    console.log('User logged in:', retrievedUser.userid)
    session.value.user = retrievedUser
  })
}

export function logout() {
  session.value.user = null
  session.value.token = null
}