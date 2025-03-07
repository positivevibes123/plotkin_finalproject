<script setup lang="ts">
import { ref } from 'vue'
import { addActivity } from '@/models/users';
import { removeActivity } from '@/models/users';
import { refActivities } from '@/models/users';

const getInitialForm = () => ({
  name: '',
  date: '',
  duration: 0,
  distance: 'Activity Distance',
  location: '',
})

const activities = refActivities();

const formData = ref(getInitialForm())

const formActive = ref(false);

// Wrapper function which calls the function to add an activity, and resets the form in this page
const callAddActivity = () => {
  const desc = (<HTMLInputElement>document.getElementById("name")).value;
  const date = (<HTMLInputElement>document.getElementById("date")).value;
  const location = (<HTMLInputElement>document.getElementById("location")).value;
  
  addActivity(desc, date, location);
  resetForm();
}

const resetForm = () => {
  formData.value = getInitialForm();

  formActive.value = false;
}

</script>

<template>
  <div class="container">
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
        <li v-for="(item, index) in activities">
          <div>
            <article class="media-box">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ item.description }}</strong>
                    <br />
                    <small>{{ item.location }}</small>
                    <br/>
                    <small>{{ item.date }}</small>
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
