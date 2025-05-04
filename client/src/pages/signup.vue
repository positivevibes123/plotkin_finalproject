<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from "../models/users"
import { signUp } from '@/models/session'

const router = useRouter()
const firstname = ref('')
const lastname = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  // Form validation
  if (!firstname.value || !lastname.value || !username.value || !password.value || !email.value) {
    errorMessage.value = 'All fields are required'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  const user: User = {
    firstname: firstname.value,
    lastname: lastname.value,
    username: username.value,
    password: password.value,
    email: email.value,
    isadmin: false
  }

  try {
    await signUp(user)
    router.push('/')
  } catch (error: any) {
    console.error('Signup error:', error)
    errorMessage.value = error.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6-tablet is-5-desktop is-4-widescreen">
            <div class="box has-shadow">
              <h1 class="title has-text-centered has-text-success">Create Account</h1>
              
              <div class="notification is-danger" v-if="errorMessage">
                <button class="delete" @click="errorMessage = ''"></button>
                {{ errorMessage }}
              </div>
              
              <form @submit.prevent="handleSubmit">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label">First Name</label>
                      <div class="control has-icons-left">
                        <input 
                          class="input" 
                          type="text" 
                          placeholder="First Name" 
                          v-model="firstname"
                          :class="{'is-danger': errorMessage}" 
                          required
                        />
                        <span class="icon is-small is-left">
                          <i class="fas fa-user"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="column">
                    <div class="field">
                      <label class="label">Last Name</label>
                      <div class="control has-icons-left">
                        <input 
                          class="input" 
                          type="text" 
                          placeholder="Last Name" 
                          v-model="lastname"
                          :class="{'is-danger': errorMessage}" 
                          required
                        />
                        <span class="icon is-small is-left">
                          <i class="fas fa-user"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left">
                    <input 
                      class="input" 
                      type="text" 
                      placeholder="Username" 
                      v-model="username"
                      :class="{'is-danger': errorMessage}" 
                      required
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
                      class="input" 
                      type="email" 
                      placeholder="Email" 
                      v-model="email"
                      :class="{'is-danger': errorMessage}" 
                      required
                    />
                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>

                <div class="field">
                  <label class="label">Password</label>
                  <div class="control has-icons-left">
                    <input 
                      class="input" 
                      type="password" 
                      placeholder="Password" 
                      v-model="password"
                      :class="{'is-danger': errorMessage}" 
                      required
                    />
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock"></i>
                    </span>
                  </div>
                  <p class="help">Password must be at least 6 characters</p>
                </div>
                
                <div class="field">
                  <label class="label">Confirm Password</label>
                  <div class="control has-icons-left">
                    <input 
                      class="input" 
                      type="password" 
                      placeholder="Confirm Password" 
                      v-model="confirmPassword"
                      :class="{'is-danger': errorMessage}" 
                      required
                    />
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock"></i>
                    </span>
                  </div>
                </div>               

                <div class="field mt-5">
                  <button 
                    type="submit" 
                    class="button is-success is-fullwidth"
                    :class="{'is-loading': loading}"
                  >
                    <span class="icon">
                      <i class="fas fa-user-plus"></i>
                    </span>
                    <span>Create Account</span>
                  </button>
                </div>
                
                <div class="has-text-centered mt-4">
                  <p>
                    Already have an account? 
                    <router-link to="/login" class="has-text-success">
                      Log in
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
