import { ref } from 'vue'
import * as myFetch from '../models/myfetch'
import { type User, addUser } from '../models/users'
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

/* export function loginWithCredentials(username: string, password: string) {
  login(username, password).then((user) => {
    const retrievedUser = (user.data as unknown as Array<any>)[0]
    console.log('User logged in:', retrievedUser.userid)
    session.value.user = retrievedUser
  })
} */

export function loginWithCredentials(username: string, password: string) {
  login(username, password).then((token) => {
    console.log("Retrieved user's token:", token.data)
    session.value.token = token.data
  })
}

export function signUp(user: User) {
  addUser(user).then((token) => {
    console.log("Created user's token: ", token.data)
    session.value.token = token.data
  })
  .catch((error) => {
    console.error('Error creating user:', error)
  })
}

export function logout() {
  session.value.user = null
  session.value.token = null
}
