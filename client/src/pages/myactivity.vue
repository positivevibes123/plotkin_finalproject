<script setup lang="ts">
import { ref } from 'vue'
import { addActivity, getUserById } from '@/models/users';
import { removeActivity } from '@/models/users';
import { refSignedInUserId } from '@/models/users';
import { getActivitiesByUserId } from '@/models/users';
import { getFullName } from '@/models/users';

const getInitialForm = () => ({
  name: '',
  date: '',
  duration: 0,
  distance: 0,
  location: '',
})

const formData = ref(getInitialForm())

const formActive = ref(false)

const signedInUserId = refSignedInUserId()

// Wrapper function which calls the function to add an activity, and resets the form in this page
const callAddActivity = () => {
  addActivity(signedInUserId.value, formData.value.name, formData.value.date, formData.value.duration, formData.value.distance, formData.value.location);
  resetForm();
}

const resetForm = () => {
  formData.value = getInitialForm();

  formActive.value = false;
}

</script>

<template>
  <div class="container" v-if="signedInUserId === 0">
    <h1 class="title">Login</h1>
    <h2 class="subtitle">Please select a user to login</h2>
  </div>
  <div class="container" v-if = "signedInUserId > 0">
    <h1 class="title">My Activity</h1>
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <button @click="formActive = !formActive" class="button is-info is-fullwidth">Add Activity</button>
        <form id="formElement" v-if="formActive">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Add a Workout</p>
                <button @click="resetForm" class="delete" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <label class="label" for="name">Title</label>
                  <input type="text" class="input" id="name" v-model="formData.name" />
                </div>
                <div class="field">
                  <label class="label" for="date">Date</label>
                  <input type="date" class="input" id="date" v-model="formData.date" />
                </div>
                <div class="field">
                  <label class="label" for="duration">Duration</label>
                  <input type="text" class="input" id="duration" v-model="formData.duration" />
                </div>
                <div class="field">
                  <label class="label" for="distance">Distance</label>
                  <input type="text" class="input" id="distance" v-model="formData.distance" />
                </div>
                <div class="field">
                  <label class="label" for="location">Location</label>
                  <input type="text" class="input" id="location" v-model="formData.location" />
                </div>
              </section>
              <footer class="modal-card-foot">
                <button @click="callAddActivity" class="button">Save changes</button>
                <button @click="resetForm" class="button">Cancel</button>
              </footer>
            </div>
          </div>
        </form>

        <br />
        <li v-for="(item, index) in getActivitiesByUserId(signedInUserId)" :key="index">
          <div>
            <article class="media-box">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong> {{ getFullName(item.userId) }}</strong>
                    <br />
                    <strong>{{ item.description }}</strong>
                    <br />
                    <small>{{ item.location }}</small>
                    <br/>
                    <small>{{ item.date }}</small>
                    <br/>
                    <div class="columns">
                      <div class="column is-half">
                        <h3 class="value">{{ item.duration }}</h3>
                        <caption class="caption">Duration</caption>
                      </div>
                      <div class="column is-half">
                        <h3 class="value">{{ item.distance + ' ft' }}</h3>
                        <caption class="caption">Distance</caption>
                      </div>
                    </div>
                  </p>
                </div>
              </div>
              <div class="media-right">
                  <button class="delete" @click="removeActivity(index)"></button>
              </div>
            </article>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
