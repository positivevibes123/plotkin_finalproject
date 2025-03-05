<script setup lang="ts">
import { ref } from 'vue'

const getInitialForm = () => ({
  name: '',
  date: '',
  duration: 0,
  distance: 'Activity Distance',
  location: '',
})

const formData = ref(getInitialForm())

const formActive = ref(false);

type activityFormat = {
  name: string
  date: string
  duration: number
  distance: string
  location: string
}

// We must definte a format here, because if ref sees the array is empty (no params) it assumes it should ALWAYS be empty
const activities = ref<activityFormat[]>([])

const addActivity = () => {
  const name = (<HTMLInputElement>document.getElementById("name")).value;
  const date = (<HTMLInputElement>document.getElementById("date")).value;
  const location = (<HTMLInputElement>document.getElementById("location")).value;
  
  const activityObject = {
    name: name,
    date: date,
    duration: 0,
    distance: 'Activity Distance',
    location: location,
  };

  // Add the activity to the array of activities to be displayed
  activities.value.push(activityObject);

  resetForm();
}

const removeActivity = (index : number) => {
  activities.value.splice(index, 1);
}

const resetForm = () => {
  formData.value = getInitialForm();

  formActive.value = false;
}

</script>

<template>
  <div class="container">
    <h1 class="title">Friends Activity</h1>
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
                <button @click="addActivity" class="button">Save changes</button>
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
                    <strong>{{ item.name }}</strong>
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
