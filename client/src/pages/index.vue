<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isLoggedIn, getSession } from '@/models/session'
import { api } from '@/models/session'
import type { DataEnvelope } from '@/models/dataEnvelope'

const loading = ref(false)

const userFirstName = computed(() => {
  return getSession()?.user?.firstname || 'Guest'
})

</script>

<template>
  <div>
    <!-- Hero section for welcome message -->
    <section class="hero is-success is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-running"></i>
              </span>
              <span>Welcome, {{ userFirstName }}!</span>
            </span>
          </h1>
          <h2 class="subtitle">
            Track your fitness journey with our activity tracker
          </h2>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="section">
      <div class="container">
        <div v-if="!isLoggedIn()" class="box has-text-centered">
          <p class="title is-4">Please log in to see your activity stats</p>
          <div class="buttons is-centered mt-5">
            <router-link to="/login" class="button is-success">
              <span class="icon">
                <i class="fas fa-sign-in-alt"></i>
              </span>
              <span>Log In</span>
            </router-link>
            <router-link to="/signup" class="button is-info">
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Sign Up</span>
            </router-link>
          </div>
        </div>

        <div v-else>
          <div v-if="loading" class="has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-3x"></i>
            </span>
            <p class="is-size-5 mt-3">Loading your activity data...</p>
          </div>

          <div v-else>

            <!-- Quick Actions -->
            <div class="box mt-5">
              <h3 class="title is-4">Quick Actions</h3>
              <div class="buttons">
                <router-link to="/myactivity" class="button is-success">
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                  <span>Add New Activity</span>
                </router-link>
                <router-link to="/friendsactivity" class="button is-info">
                  <span class="icon">
                    <i class="fas fa-users"></i>
                  </span>
                  <span>View Friends' Activities</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.summary {
  transition: all 0.3s ease;
}

.summary:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.value {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.caption {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
