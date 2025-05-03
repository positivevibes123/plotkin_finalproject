import { api } from './session'
import type { DataListEnvelope, DataEnvelope } from './dataEnvelope'

export interface User {
    userid?: number,
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email: string,
    isadmin: boolean
}

export interface UserResponse extends Omit<User, 'password'> {
    userid: number
}

export async function addUser(user: Omit<User, 'id'>): Promise<DataEnvelope<string>> {
    const response = await api<DataEnvelope<string>>('users', user, 'POST')
    if (!response.isSuccess) {
      throw new Error(`Failed to create user: ${response.message}`)
    }
    return response
  }

export function getAll(): Promise<DataListEnvelope<User>> {
    return api('users')
}

export async function get(id: number) : Promise<DataEnvelope<User>> {
    const response = await api<DataEnvelope<User>>(`users/${id}`, undefined, 'GET')
  
    if (!response.isSuccess) {
      throw new Error(`Failed to login user: ${response.message}`)
    }

    return response
  }

  export async function login(username: string, password: string) : Promise<DataEnvelope<string>> {
    const response = await api<DataEnvelope<string>>(`users/login`, {username, password}, 'POST')
  
    if (!response.isSuccess) {
      throw new Error(`Failed to login user: ${response.message}`)
    }

    return response
  }
