import { api } from './session'
import type { DataListEnvelope, DataEnvelope } from './dataEnvelope'

export interface User {
    userId?: number,
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

export async function addUser(user: Omit<User, 'id'>): Promise<DataEnvelope<UserResponse>> {
    const response = await api<DataEnvelope<UserResponse>>('users', user, 'POST')
    if (!response.isSuccess) {
      throw new Error(`Failed to create user: ${response.message}`)
    }
    return response
  }

export function getAll(): Promise<DataListEnvelope<User>> {
    return api('users')
}

export function get(id: number): Promise<User> {
    return api(`users/${id}`)
}
  