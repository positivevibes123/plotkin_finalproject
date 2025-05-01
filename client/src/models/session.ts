import { ref } from 'vue'
import * as myFetch from '../models/myfetch'
import { type User, addUser, get } from '../models/users'
import { login } from '../models/users'
import { jwtDecode } from 'jwt-decode'

// Add this type definition for the decoded JWT
interface DecodedToken {
  userid: number
  isAdmin: boolean
  iat: number
  exp: number
}

export function api<T>(url: string, data?: any, method?: string): Promise<T> {
  return myFetch.api<T>(url, data, method)
}

const session = ref({
  user: null as User | null,
  token: null as string | null,
  decoded: null as DecodedToken | null,
})

// Load session from localStorage on init
const savedToken = localStorage.getItem('auth_token')
if (savedToken) {
  try {
    session.value.token = savedToken
    session.value.decoded = jwtDecode<DecodedToken>(savedToken)
    // Fetch user details
    fetchUserDetails()
  } catch (error) {
    console.error('Failed to decode saved token:', error)
    localStorage.removeItem('auth_token')
  }
}

// Returns the reactive session ref object that can be used in components
export function refSession() {
  return session
}

// Returns the unwrapped session value (for use in non-reactive contexts)
export function getSession() {
  return session.value
}

export const isAdmin = () => session.value?.decoded?.isAdmin === true

export const isLoggedIn = () => session.value?.token !== null && session.value?.decoded !== null

// Helper function to fetch user details based on the decoded token
async function fetchUserDetails() {
  if (!session.value.decoded?.userid) return
  
  try {
    const response = await get(session.value.decoded.userid)
    if (response.isSuccess && response.data) {
      // Handle the response data properly based on its structure
      if (Array.isArray(response.data)) {
        session.value.user = response.data[0]
      } else {
        session.value.user = response.data
      }
    }
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  }
}

export function loginWithCredentials(username: string, password: string) {
  return login(username, password)
    .then((response) => {
      const token = response.data
      console.log("Retrieved user's token:", token)
      
      // Save token to session
      session.value.token = token
      
      // Decode token to get user info
      session.value.decoded = jwtDecode<DecodedToken>(token)
      
      // Save token to localStorage for persistence
      localStorage.setItem('auth_token', token)
      
      // Fetch user details
      return fetchUserDetails()
    })
    .catch((error) => {
      console.error('Login failed:', error)
      throw error
    })
}

export function signUp(user: User) {
  return addUser(user)
    .then((response) => {
      const token = response.data
      console.log("Created user's token: ", token)
      
      // Save token to session
      session.value.token = token
      
      // Decode token to get user info
      session.value.decoded = jwtDecode<DecodedToken>(token)
      
      // Save token to localStorage for persistence
      localStorage.setItem('auth_token', token)
      
      // Fetch user details
      return fetchUserDetails()
    })
    .catch((error) => {
      console.error('Error creating user:', error)
      throw error
    })
}

export function logout() {
  session.value.user = null
  session.value.token = null
  session.value.decoded = null
  localStorage.removeItem('auth_token')
}
