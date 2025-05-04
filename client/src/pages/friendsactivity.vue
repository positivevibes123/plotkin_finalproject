<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isLoggedIn, getSession } from '@/models/session'
import { api } from '@/models/session'
import type { DataEnvelope, DataListEnvelope } from '@/models/dataEnvelope'
import { useRouter } from 'vue-router'

interface User {
  userid: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Location {
  locationid: number;
  locationName: string;
  userid: number;
}

interface Activity {
  activityid: number;
  userid: number;
  description: string;
  duration: number;
  distance: number;
  locationid: number;
  date?: string;
  user?: User;
  location?: Location;
}

const router = useRouter()
const activities = ref<Activity[]>([])
const users = ref<User[]>([])
const loading = ref(false)
const errorMessage = ref('')
const searchTerm = ref('')

// Computed property for filtered activities
const filteredActivities = computed(() => {
  let result = activities.value
  
  // Filter by search term if one is provided
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(activity => 
      activity.description.toLowerCase().includes(term) ||
      activity.location?.locationName.toLowerCase().includes(term) ||
      getUserFullName(activity.userid).toLowerCase().includes(term)
    )
  }
  
  // Sort by date (newest first)
  return result.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

// Load data on component mount
onMounted(async () => {
  if (!isLoggedIn()) {
    router.push('/login')
    return
  }
  
  await Promise.all([
    loadActivities(),
    loadUsers()
  ])
})

async function loadActivities() {
  loading.value = true
  try {
    const response = await api<DataListEnvelope<Activity>>('activities')
    if (response && response.data) {
      activities.value = response.data
    }
  } catch (error) {
    console.error('Error loading activities:', error)
    errorMessage.value = 'Failed to load activities'
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  try {
    const response = await api<DataListEnvelope<User>>('users')
    if (response && response.data) {
      users.value = response.data
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

function getUserFullName(userid: number): string {
  const user = users.value.find(u => u.userid === userid)
  return user ? `${user.firstname} ${user.lastname}` : 'Unknown User'
}

function getUserAvatar(userid: number): string {
  const user = users.value.find(u => u.userid === userid)
  if (!user) return ''
  
  const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`
  return initials.toUpperCase()
}

function getLocationName(locationid: number): string {
  const activity = activities.value.find(a => a.locationid === locationid)
  return activity?.location?.locationName || 'Unknown location'
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

function clearFilters() {
  searchTerm.value = ''
}
</script>

<template>
  <div>
    <!-- Hero section for page title -->
    <section class="hero is-info is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-users"></i>
              </span>
              <span>Friends Activity</span>
            </span>
          </h1>
          <h2 class="subtitle">
            See what your friends are up to
          </h2>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="section">
      <div class="container">
        <div class="notification is-danger" v-if="errorMessage">
          <button class="delete" @click="errorMessage = ''"></button>
          {{ errorMessage }}
        </div>
        
        <!-- Filters Section -->
        <div class="box mb-5">
          <div class="columns">
            <div class="column is-8">
              <div class="field">
                <label class="label">Search</label>
                <div class="control has-icons-left">
                  <input
                    type="text"
                    class="input"
                    placeholder="Search by activity description"
                    v-model="searchTerm"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="field is-grouped">
            <div class="control">
              <button
                class="button is-light"
                @click="clearFilters"
                :disabled="!searchTerm"
              >
                <span class="icon">
                  <i class="fas fa-undo"></i>
                </span>
                <span>Clear Filters</span>
              </button>
            </div>
            
            <div class="control">
              <button
                class="button is-info"
                @click="loadActivities"
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
        
        <!-- Loading Indicator -->
        <div v-if="loading" class="has-text-centered my-6">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-3x"></i>
          </span>
          <p class="is-size-5 mt-3">Loading activities...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="activities.length === 0" class="has-text-centered my-6">
          <div class="icon is-large">
            <i class="fas fa-users fa-3x has-text-grey-light"></i>
          </div>
          <p class="is-size-5 mt-4 has-text-grey">
            No activities found.
            <br>
            Check back later when your friends post their workouts!
          </p>
        </div>
        
        <!-- Filtered Empty State -->
        <div v-else-if="filteredActivities.length === 0" class="has-text-centered my-6">
          <div class="icon is-large">
            <i class="fas fa-filter fa-3x has-text-grey-light"></i>
          </div>
          <p class="is-size-5 mt-4 has-text-grey">
            No activities match your filters.
            <br>
            Try adjusting your search or filter criteria.
          </p>
          <button class="button is-info mt-4" @click="clearFilters">
            <span class="icon">
              <i class="fas fa-undo"></i>
            </span>
            <span>Clear Filters</span>
          </button>
        </div>
        
        <!-- Activities Feed -->
        <div v-else>
          <div class="activity-feed">
            <div v-for="activity in filteredActivities" :key="activity.activityid" class="card mb-5 activity-card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <div class="avatar-circle">
                      {{ getUserAvatar(activity.userid) }}
                    </div>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">{{ getUserFullName(activity.userid) }}</p>
                    <p class="subtitle is-6">
                      <span class="icon-text">
                        <span class="icon has-text-info">
                          <i class="fas fa-map-marker-alt"></i>
                        </span>
                        <span>{{ getLocationName(activity.locationid) }}</span>
                      </span>
                    </p>
                  </div>
                  <div class="media-right">
                    <p class="has-text-grey-light">
                      {{ activity.date }}
                    </p>
                  </div>
                </div>
                
                <div class="content mt-4">
                  <h3 class="is-size-4">{{ activity.description }}</h3>
                  
                  <div class="columns mt-4 is-mobile has-text-centered">
                    <div class="column">
                      <div class="stat-box">
                        <p class="heading">Distance</p>
                        <p class="title is-4 has-text-black">{{ activity.distance }} mi</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="stat-box">
                        <p class="heading">Duration</p>
                        <p class="title is-4 has-text-black">{{ formatDuration(activity.duration) }}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="stat-box">
                        <p class="heading">Pace</p>
                        <p class="title is-4 has-text-black">
                          {{ (activity.distance / (activity.duration / 60)).toFixed(1) }} mph
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.activity-feed {
  max-width: 800px;
  margin: 0 auto;
}

.activity-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(10, 10, 10, 0.1);
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: #209cee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.stat-box {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.stat-box:hover {
  background-color: #e8e8e8;
  transform: translateY(-3px);
}

.heading {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #777;
  margin-bottom: 0.5rem;
}
</style>
