<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn, isAdmin, refSession, logout } from '@/models/session'

const isBurgerActive = ref(false)
const router = useRouter()
const session = refSession()

const userName = computed(() => {
  if (session.value.user) {
    return `${session.value.user.firstname} ${session.value.user.lastname}`
  }
  return ''
})

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <div class="logo-container">
          <span class="icon is-large">
            <i class="fas fa-dumbbell fa-2x"></i>
          </span>
          <span class="logo-text">FitTrack</span>
        </div>
      </router-link>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        :class="{ 'is-active': isBurgerActive }"
        @click="isBurgerActive = !isBurgerActive"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isBurgerActive }">
      <div class="navbar-start">
        <router-link to="/myactivity" class="navbar-item" v-if="isLoggedIn()">
          <span class="icon">
            <i class="fas fa-running"></i>
          </span>
          <span>My Activity</span>
        </router-link>

        <router-link to="/friendsactivity" class="navbar-item" v-if="isLoggedIn()">
          <span class="icon">
            <i class="fas fa-users"></i>
          </span>
          <span>Friends Activity</span>
        </router-link>

        <router-link to="/search" class="navbar-item" v-if="isLoggedIn()">
          <span class="icon">
            <i class="fas fa-search"></i>
          </span>
          <span>People Search</span>
        </router-link>

        <div class="navbar-item has-dropdown is-hoverable" v-if="isAdmin()">
          <a class="navbar-link">
            <span class="icon">
              <i class="fas fa-shield-alt"></i>
            </span>
            <span>Admin</span>
          </a>

          <div class="navbar-dropdown">
            <router-link to="/admin" class="navbar-item">
              <span class="icon">
                <i class="fas fa-users-cog"></i>
              </span>
              <span>Users</span>
            </router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons" v-if="isLoggedIn()">
            <div class="avatar mr-2">
              <span class="icon">
                <i class="fas fa-user-circle"></i>
              </span>
              <strong>{{ userName }}</strong>
            </div>
            <button class="button is-light" @click="handleLogout">
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              <span>Log Out</span>
            </button>
          </div>
          <div class="buttons" v-else>
            <router-link to="/signup" class="button is-primary">
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Sign up</span>
            </router-link>

            <router-link to="/login" class="button is-light">
              <span class="icon">
                <i class="fas fa-sign-in-alt"></i>
              </span>
              <span>Log in</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
