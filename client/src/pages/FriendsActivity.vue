<script setup lang="ts">
import { ref } from 'vue'
type activityFormat = {
  name: string
  description: string
  date: string
  time: string
  location: string
}

// We must definte a format here, because if ref sees the array is empty (no params) it assumes it should ALWAYS be empty
const data = ref<activityFormat[]>([])

const addActivity = () => {
  const activityObject = {
    name: 'Activity Name',
    description: 'Activity Description',
    date: 'Activity Date',
    time: 'Activity Time',
    location: 'Activity Location',
  }

  data.value.push(activityObject)
  console.log(data.value[data.value.length - 1])
}
</script>

<template>
  <div class="container">
    <h1 class="title">Friends Activity</h1>
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <button @click="addActivity" class="button is-info is-fullwidth">Add Activity</button>
        <form>
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Add a Workout</p>
                <button class="delete" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <label class="label" for="name">Title</label>
                  <input type="text" class="input" id="name" />
                </div>
                <div class="field">
                  <label class="label" for="date">Date</label>
                  <input type="date" class="input" id="date" />
                </div>
                <div class="field">
                  <label class="label" for="duration">Duration</label>
                  <input type="text" class="input" id="duration" />
                </div>
                <div class="field">
                  <label class="label" for="location">Location</label>
                  <input type="text" class="input" id="location" />
                </div>
                <div class="field">
                  <label class="label" for="picture">Picture</label>
                  <input type="text" class="input" id="picture" />
                </div>
                <div class="field">
                  <label class="label" for="type">Type</label>
                  <div class="select is-full-width">
                    <select class="form-control" id="type">
                      <option value="run">Run</option>
                      <option value="bike">Bike</option>
                      <option value="swim">Walk</option>
                      <option value="cardio">Cardio</option>
                      <option value="strength">Strength</option>
                    </select>
                  </div>
                </div>
              </section>
              <footer class="modal-card-foot">
                <button class="button is-success">Save changes</button>
                <button class="button">Cancel</button>
              </footer>
            </div>
          </div>
        </form>

        <br />
        <li v-for="(item, index) in data">
          <div>
            <article class="media-box">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ item.name }}</strong>
                    <br />
                    {{ item.description }}
                    <br />
                    <small>{{ item.date }} at {{ item.time }}</small>
                    <br />
                    <small>{{ item.location }}</small>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
