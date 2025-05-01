<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isAdmin, refSession, getSession } from '@/models/session'
import { api } from '@/models/session'
import type { DataEnvelope, DataListEnvelope } from '@/models/dataEnvelope'
import type { User } from '@/models/users'

interface UserWithActions extends User {
  isEditing?: boolean
}

const session = refSession()
const users = ref<UserWithActions[]>([])
const loading = ref(false)
const formActive = ref(false)
const editMode = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const getInitialForm = () => ({
  userId: undefined as number | undefined,
  username: '',
  password: '',
  firstname: '',
  lastname: '',
  email: '',
  isadmin: false,
})

const formData = ref(getInitialForm())

// Load users on component mount
onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  loading.value = true
  try {
    const response = await api<DataListEnvelope<User>>('users')
    if (response && response.data) {
      users.value = response.data.map(user => ({
        ...user,
        isEditing: false
      }))
    }
  } catch (error) {
    console.error('Error loading users:', error)
    errorMessage.value = 'Failed to load users. Please try again.'
  } finally {
    loading.value = false
  }
}

function showEditForm(user: UserWithActions) {
  editMode.value = true
  formActive.value = true
  formData.value = {
    userId: user.userId,
    username: user.username,
    password: '', // Don't populate password for security
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    isadmin: user.isadmin
  }
}

async function handleSubmit() {
  try {
    errorMessage.value = ''
    loading.value = true
    
    if (editMode.value && formData.value.userId) {
      // Update existing user
      const userData = { ...formData.value }
      
      // Don't send empty password in updates
      let dataToSend: any = { ...userData }
      if (!dataToSend.password) {
        const { password, ...rest } = dataToSend
        dataToSend = rest
      }
      
      const response = await api<DataEnvelope<User>>(
        `users/${userData.userId}`,
        dataToSend,
        'PATCH'
      )
      
      if (response.isSuccess) {
        successMessage.value = 'User updated successfully'
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      }
    } else {
      // Create new user
      const response = await api<DataEnvelope<string>>(
        'users',
        formData.value,
        'POST'
      )
      
      if (response.isSuccess) {
        successMessage.value = 'User created successfully'
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      }
    }
    
    // Refresh user list
    await loadUsers()
    resetForm()
  } catch (error: any) {
    console.error('Error submitting user:', error)
    errorMessage.value = error.message || 'Failed to save user data'
  } finally {
    loading.value = false
  }
}

async function deleteUser(userId: number) {
  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }
  
  try {
    loading.value = true
    const response = await api<DataEnvelope<any>>(`users/${userId}`, null, 'DELETE')
    
    if (response.isSuccess) {
      successMessage.value = 'User deleted successfully'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
      await loadUsers()
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    errorMessage.value = error.message || 'Failed to delete user'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  formData.value = getInitialForm()
  formActive.value = false
  editMode.value = false
}
</script>

<template>
  <div class="container" v-if="!isAdmin()">
    <section class="hero is-medium is-danger">
      <div class="hero-body">
        <p class="title">
          <span class="icon">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          Admin Access Required
        </p>
        <p class="subtitle">
          This page is for administrators only. Please log in with an admin account.
        </p>
      </div>
    </section>
  </div>
  
  <div class="container" v-else>
    <section class="section">
      <h1 class="title">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-users-cog"></i>
          </span>
          <span>User Management</span>
        </span>
      </h1>
      
      <div class="notification is-success" v-if="successMessage">
        <button class="delete" @click="successMessage = ''"></button>
        {{ successMessage }}
      </div>
      
      <div class="notification is-danger" v-if="errorMessage">
        <button class="delete" @click="errorMessage = ''"></button>
        {{ errorMessage }}
      </div>
    
      <!-- User Form Modal -->
      <div class="modal" :class="{ 'is-active': formActive }">
        <div class="modal-background" @click="resetForm"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">
              <span class="icon">
                <i :class="editMode ? 'fas fa-user-edit' : 'fas fa-user-plus'"></i>
              </span>
              <span>{{ editMode ? 'Edit User' : 'Add New User' }}</span>
            </p>
            <button class="delete" aria-label="close" @click="resetForm"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Username</label>
              <div class="control has-icons-left">
                <input 
                  type="text" 
                  class="input" 
                  placeholder="Username" 
                  v-model="formData.username"
                  :disabled="editMode"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
              </div>
            </div>
            
            <div class="field">
              <label class="label">Password</label>
              <div class="control has-icons-left">
                <input 
                  type="password" 
                  class="input" 
                  placeholder="Leave blank to keep current password" 
                  v-model="formData.password"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </div>
              <p class="help" v-if="editMode">Leave blank to keep current password</p>
            </div>
            
            <div class="field">
              <label class="label">First Name</label>
              <div class="control has-icons-left">
                <input 
                  type="text" 
                  class="input" 
                  placeholder="First Name" 
                  v-model="formData.firstname"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
              </div>
            </div>
            
            <div class="field">
              <label class="label">Last Name</label>
              <div class="control has-icons-left">
                <input 
                  type="text" 
                  class="input" 
                  placeholder="Last Name" 
                  v-model="formData.lastname"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
              </div>
            </div>
            
            <div class="field">
              <label class="label">Email</label>
              <div class="control has-icons-left">
                <input 
                  type="email" 
                  class="input" 
                  placeholder="Email" 
                  v-model="formData.email"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>
            
            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="formData.isadmin">
                  Administrator
                </label>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button 
              class="button is-success" 
              @click="handleSubmit"
              :class="{ 'is-loading': loading }"
            >
              <span class="icon">
                <i class="fas fa-save"></i>
              </span>
              <span>Save</span>
            </button>
            <button class="button" @click="resetForm">Cancel</button>
          </footer>
        </div>
      </div>
      
      <!-- Actions Row -->
      <div class="level mb-5">
        <div class="level-left">
          <div class="level-item">
            <button 
              class="button is-primary" 
              @click="formActive = true"
              :disabled="loading"
            >
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Add User</span>
            </button>
          </div>
          <div class="level-item" v-if="loading">
            <span class="icon has-text-info">
              <i class="fas fa-spinner fa-pulse"></i>
            </span>
            <span>Loading...</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button 
              class="button is-info" 
              @click="loadUsers"
              :disabled="loading"
            >
              <span class="icon">
                <i class="fas fa-sync-alt"></i>
              </span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Users Table -->
      <div class="table-container">
        <table class="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="users.length > 0">
            <tr v-for="user in users" :key="user.userId">
              <td>{{ user.userId }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.firstname }} {{ user.lastname }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span 
                  class="tag" 
                  :class="user.isadmin ? 'is-danger' : 'is-info'"
                >
                  <span class="icon">
                    <i :class="user.isadmin ? 'fas fa-user-shield' : 'fas fa-user'"></i>
                  </span>
                  <span>{{ user.isadmin ? 'Admin' : 'User' }}</span>
                </span>
              </td>
              <td>
                <div class="buttons are-small">
                  <button 
                    class="button is-warning" 
                    @click="showEditForm(user)"
                    :disabled="loading || user.userId === getSession()?.decoded?.userid"
                    :title="user.userId === getSession()?.decoded?.userid ? 'Cannot edit your own account' : 'Edit user'"
                  >
                    <span class="icon">
                      <i class="fas fa-edit"></i>
                    </span>
                  </button>
                  <button 
                    class="button is-danger" 
                    @click="deleteUser(user.userId!)"
                    :disabled="loading || user.userId === getSession()?.decoded?.userid"
                    :title="user.userId === getSession()?.decoded?.userid ? 'Cannot delete your own account' : 'Delete user'"
                  >
                    <span class="icon">
                      <i class="fas fa-trash-alt"></i>
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="has-text-centered">
                <p class="has-text-grey-light my-5" v-if="loading">
                  <span class="icon">
                    <i class="fas fa-spinner fa-pulse"></i>
                  </span>
                  <span>Loading users...</span>
                </p>
                <p class="has-text-grey-light my-5" v-else>
                  <span class="icon">
                    <i class="fas fa-user-slash"></i>
                  </span>
                  <span>No users found</span>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
