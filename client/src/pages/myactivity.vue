<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isLoggedIn, getSession } from '@/models/session'
import { api } from '@/models/session'
import type { DataEnvelope, DataListEnvelope } from '@/models/dataEnvelope'
import { useRouter } from 'vue-router'

interface Location {
  locationid: number;
  locationName: string;
  userid: number;
}

interface Activity {
  activityid?: number;
  userid: number;
  description: string;
  duration: number;
  distance: number;
  locationid: number;
  date?: string;
  location?: Location;
}

const router = useRouter()
const activities = ref<Activity[]>([])
const locations = ref<Location[]>([])
const loading = ref(false)
const formActive = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)

const getInitialForm = () => ({
  activityid: undefined as number | undefined,
  userid: getSession()?.decoded?.userid,
  description: '',
  date: new Date().toISOString().slice(0, 10),
  duration: 0,
  distance: 0,
  locationid: 0,
  locationName: ''
})

const formData = ref(getInitialForm())

// Load data on component mount
onMounted(async () => {
  if (!isLoggedIn()) {
    router.push('/login')
    return
  }
  
  await Promise.all([
    loadActivities(),
    loadLocations()
  ])
})

async function loadActivities() {
  loading.value = true
  try {
    const userid = getSession()?.decoded?.userid
    if (!userid) return

    const response = await api<DataListEnvelope<Activity>>(`activities/user/${userid}`)
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

async function loadLocations() {
  try {
    const userid = getSession()?.decoded?.userid
    if (!userid) return

    const response = await api<DataListEnvelope<Location>>(`locations/user/${userid}`)
    if (response && response.data) {
      locations.value = response.data
    }
  } catch (error) {
    console.error('Error loading locations:', error)
  }
}

function showEditForm(activity: Activity) {
  editMode.value = true
  formActive.value = true
  
  // Get the location name
  const location = locations.value.find(loc => loc.locationid === activity.locationid)
  
  formData.value = {
    activityid: activity.activityid,
    userid: activity.userid,
    description: activity.description,
    date: activity.date || new Date().toISOString().slice(0, 10),
    duration: activity.duration,
    distance: activity.distance,
    locationid: activity.locationid,
    locationName: location?.locationName || ''
  }
}

async function handleSubmit() {
  try {
    errorMessage.value = ''
    loading.value = true
    
    // Check if location exists, if not create it
    let locationid = formData.value.locationid
    if (!locationid && formData.value.locationName) {
      const locationResponse = await api<DataEnvelope<Location>>('locations', {
        locationName: formData.value.locationName,
        userid: getSession()?.decoded?.userid
      }, 'POST')
      
      if (locationResponse.isSuccess && locationResponse.data) {
        locationid = locationResponse.data.locationid
        // Refresh locations
        await loadLocations()
      }
    }
    
    const activityData = {
      userid: getSession()?.decoded?.userid,
      description: formData.value.description,
      duration: Number(formData.value.duration),
      distance: Number(formData.value.distance),
      locationid: locationid,
      date: formData.value.date
    }
    
    if (editMode.value && formData.value.activityid) {
      // Update existing activity
      const response = await api<DataEnvelope<Activity>>(
        `activities/${formData.value.activityid}`,
        activityData,
        'PATCH'
      )
      
      if (response.isSuccess) {
        successMessage.value = 'Activity updated successfully'
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      }
    } else {
      // Create new activity
      const response = await api<DataEnvelope<Activity>>(
        'activities',
        activityData,
        'POST'
      )
      
      if (response.isSuccess) {
        successMessage.value = 'Activity created successfully'
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      }
    }
    
    // Refresh activity list
    await loadActivities()
    resetForm()
  } catch (error: any) {
    console.error('Error submitting activity:', error)
    errorMessage.value = error.message || 'Failed to save activity data'
  } finally {
    loading.value = false
  }
}

async function deleteActivity(activityId: number) {
  if (!confirm('Are you sure you want to delete this activity?')) {
    return
  }
  
  try {
    loading.value = true
    const response = await api<DataEnvelope<any>>(`activities/${activityId}`, null, 'DELETE')
    
    if (response.isSuccess) {
      successMessage.value = 'Activity deleted successfully'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
      await loadActivities()
    }
  } catch (error: any) {
    console.error('Error deleting activity:', error)
    errorMessage.value = error.message || 'Failed to delete activity'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  formData.value = getInitialForm()
  formActive.value = false
  editMode.value = false
}

function getLocationName(locationId: number): string {
  const location = locations.value.find(loc => loc.locationid === locationId)
  return location?.locationName || 'Unknown location'
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}:${mins.toString().padStart(2, '0')}`
}
</script>

<template>
  <div>
    <!-- Hero section for page title -->
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-running"></i>
              </span>
              <span>My Activities</span>
            </span>
          </h1>
          <h2 class="subtitle">
            Track and manage your fitness activities
          </h2>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="section">
      <div class="container">
        <div class="notification is-success" v-if="successMessage">
          <button class="delete" @click="successMessage = ''"></button>
          {{ successMessage }}
        </div>
        
        <div class="notification is-danger" v-if="errorMessage">
          <button class="delete" @click="errorMessage = ''"></button>
          {{ errorMessage }}
        </div>
        
        <!-- Activity Form Modal -->
        <div class="modal" :class="{ 'is-active': formActive }">
          <div class="modal-background" @click="resetForm"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">
                <span class="icon">
                  <i :class="editMode ? 'fas fa-edit' : 'fas fa-plus'"></i>
                </span>
                <span>{{ editMode ? 'Edit Activity' : 'Add New Activity' }}</span>
              </p>
              <button class="delete" aria-label="close" @click="resetForm"></button>
            </header>
            <section class="modal-card-body">
              <div class="field">
                <label class="label">Description</label>
                <div class="control">
                  <input
                    type="text"
                    class="input"
                    placeholder="Activity description"
                    v-model="formData.description"
                    required
                  />
                </div>
              </div>
              
              <div class="field">
                <label class="label">Date</label>
                <div class="control">
                  <input
                    type="date"
                    class="input"
                    v-model="formData.date"
                    required
                  />
                </div>
              </div>
              
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Duration (minutes)</label>
                    <div class="control">
                      <input
                        type="number"
                        class="input"
                        placeholder="Duration in minutes"
                        v-model.number="formData.duration"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div class="column">
                  <div class="field">
                    <label class="label">Distance (miles)</label>
                    <div class="control">
                      <input
                        type="number"
                        class="input"
                        placeholder="Distance in miles"
                        v-model.number="formData.distance"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="field">
                <label class="label">Location</label>
                <div class="control">
                  <div class="select is-fullwidth" v-if="locations.length > 0">
                    <select v-model="formData.locationid">
                      <option :value="0">Select a location or enter a new one</option>
                      <option
                        v-for="location in locations"
                        :key="location.locationid"
                        :value="location.locationid"
                      >
                        {{ location.locationName }}
                      </option>
                    </select>
                  </div>
                  
                  <input
                    v-if="formData.locationid === 0"
                    type="text"
                    class="input mt-2"
                    placeholder="Enter new location name"
                    v-model="formData.locationName"
                  />
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button
                class="button is-primary"
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
                  <i class="fas fa-plus"></i>
                </span>
                <span>Add Activity</span>
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
        
        <!-- Activities List -->
        <div v-if="activities.length === 0 && !loading" class="has-text-centered my-6">
          <div class="icon is-large">
            <i class="fas fa-running fa-3x has-text-grey-light"></i>
          </div>
          <p class="is-size-5 mt-4 has-text-grey">
            You haven't logged any activities yet.
            <br>
            Click "Add Activity" to get started!
          </p>
        </div>
        
        <div v-else class="columns is-multiline">
          <div v-for="activity in activities" :key="activity.activityid" class="column is-4">
            <div class="card activity-card">
              <header class="card-header">
                <p class="card-header-title">
                  {{ activity.description }}
                </p>
                <button class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-running" aria-hidden="true"></i>
                  </span>
                </button>
              </header>
              <div class="card-content">
                <div class="content">
                  <div class="columns is-mobile">
                    <div class="column">
                      <p class="heading">Date</p>
                      <p class="title is-5">{{ activity.date }}</p>
                    </div>
                    <div class="column">
                      <p class="heading">Location</p>
                      <p class="title is-5">{{ getLocationName(activity.locationid) }}</p>
                    </div>
                  </div>
                  <div class="columns is-mobile mt-2">
                    <div class="column">
                      <p class="heading">Distance</p>
                      <p class="title is-5">{{ activity.distance }} mi</p>
                    </div>
                    <div class="column">
                      <p class="heading">Duration</p>
                      <p class="title is-5">{{ formatDuration(activity.duration) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item" @click="showEditForm(activity)">
                  <span class="icon">
                    <i class="fas fa-edit"></i>
                  </span>
                  <span>Edit</span>
                </a>
                <a class="card-footer-item" @click="activity.activityid && deleteActivity(activity.activityid)">
                  <span class="icon">
                    <i class="fas fa-trash-alt"></i>
                  </span>
                  <span>Delete</span>
                </a>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.activity-card {
  height: 100%;
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
}

.card-footer-item {
  cursor: pointer;
}

.card-footer-item:hover {
  background-color: #f5f5f5;
}
</style>
