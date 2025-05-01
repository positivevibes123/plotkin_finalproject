<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginWithCredentials } from '../models/session'

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function handleSubmit() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter both username and password'
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  try {
    await loginWithCredentials(username.value, password.value)
    router.push('/')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.'
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
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <div class="box has-shadow">
              <h1 class="title has-text-centered has-text-success">Log In</h1>
              
              <div class="notification is-danger" v-if="errorMessage">
                <button class="delete" @click="errorMessage = ''"></button>
                {{ errorMessage }}
              </div>
              
              <form @submit.prevent="handleSubmit">
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
                </div>

                <div class="field mt-5">
                  <button 
                    type="submit" 
                    class="button is-success is-fullwidth"
                    :class="{'is-loading': loading}"
                  >
                    <span class="icon">
                      <i class="fas fa-sign-in-alt"></i>
                    </span>
                    <span>Login</span>
                  </button>
                </div>
                
                <div class="has-text-centered mt-4">
                  <p>
                    Don't have an account? 
                    <router-link to="/signup" class="has-text-success">
                      Sign up
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
