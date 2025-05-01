<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isLoggedIn, getSession } from '@/models/session'
import { api } from '@/models/session'
import type { DataEnvelope } from '@/models/dataEnvelope'

interface ActivitySummary {
  today: {
    distance: number;
    duration: string;
    avgPace: number;
    calories: number;
  };
  week: {
    distance: number;
    duration: string;
    avgPace: number;
    calories: number;
  };
  allTime: {
    distance: number;
    duration: string;
    avgPace: number;
    calories: number;
  };
}

const loading = ref(false)
const summary = ref<ActivitySummary>({
  today: { distance: 0, duration: '0:0', avgPace: 0, calories: 0 },
  week: { distance: 0, duration: '0:0', avgPace: 0, calories: 0 },
  allTime: { distance: 3.8, duration: '2:45', avgPace: 1.4, calories: 1127.5 }
})

const userFirstName = computed(() => {
  return getSession()?.user?.firstname || 'Guest'
})

onMounted(async () => {
  if (isLoggedIn()) {
    await loadActivitySummary()
  }
})

async function loadActivitySummary() {
  try {
    loading.value = true
    const response = await api<DataEnvelope<ActivitySummary>>('activities/summary')
    if (response.isSuccess && response.data) {
      summary.value = response.data
    }
  } catch (error) {
    console.error('Failed to load activity summary:', error)
  } finally {
    loading.value = false
  }
}
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
            <div class="columns is-multiline">
              <!-- Today's Stats -->
              <div class="column is-one-third">
                <div class="box has-text-success summary">
                  <h2 class="title is-4">
                    <span class="icon-text">
                      <span class="icon">
                        <i class="fas fa-calendar-day"></i>
                      </span>
                      <span>Today</span>
                    </span>
                  </h2>
                  <div class="columns is-multiline">
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.today.distance }} mi</h3>
                      <p class="caption has-text-grey">Distance</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.today.duration }}</h3>
                      <p class="caption has-text-grey">Duration</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.today.avgPace }} mph</h3>
                      <p class="caption has-text-grey">Avg Pace</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.today.calories }}</h3>
                      <p class="caption has-text-grey">Calories</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- This Week Stats -->
              <div class="column is-one-third">
                <div class="box has-text-info summary">
                  <h2 class="title is-4">
                    <span class="icon-text">
                      <span class="icon">
                        <i class="fas fa-calendar-week"></i>
                      </span>
                      <span>This Week</span>
                    </span>
                  </h2>
                  <div class="columns is-multiline">
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.week.distance }} mi</h3>
                      <p class="caption has-text-grey">Distance</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.week.duration }}</h3>
                      <p class="caption has-text-grey">Duration</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.week.avgPace }} mph</h3>
                      <p class="caption has-text-grey">Avg Pace</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.week.calories }}</h3>
                      <p class="caption has-text-grey">Calories</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- All Time Stats -->
              <div class="column is-one-third">
                <div class="box has-text-danger summary">
                  <h2 class="title is-4">
                    <span class="icon-text">
                      <span class="icon">
                        <i class="fas fa-history"></i>
                      </span>
                      <span>All Time</span>
                    </span>
                  </h2>
                  <div class="columns is-multiline">
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.allTime.distance }} mi</h3>
                      <p class="caption has-text-grey">Distance</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.allTime.duration }}</h3>
                      <p class="caption has-text-grey">Duration</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.allTime.avgPace }} mph</h3>
                      <p class="caption has-text-grey">Avg Pace</p>
                    </div>
                    <div class="column is-half">
                      <h3 class="value is-size-4">{{ summary.allTime.calories }}</h3>
                      <p class="caption has-text-grey">Calories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
