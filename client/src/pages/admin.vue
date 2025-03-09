<script setup lang="ts">
import { ref } from 'vue'
import { addUser, isSignedInUserAdmin } from '@/models/users'
import { refUsers } from '@/models/users'
import { refSignedInUserId } from '@/models/users'
import { getUsersExcludingUserId } from '@/models/users'
import { removeUser } from '@/models/users'

const users = refUsers()
const signedInUserId = refSignedInUserId()

const formActive = ref(false)

const getInitialForm = () => ({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isAdmin: false,
})

const formData = ref(getInitialForm())

// Wrapper function which calls the function to add an activity, and resets the form in this page
const callAddActivity = () => {
  addUser(formData.value.username, formData.value.firstName, formData.value.lastName, formData.value.email, formData.value.isAdmin);
  resetForm();
}

const resetForm = () => {
  formData.value = getInitialForm();

  formActive.value = false;
}
</script>

<template>
  <div class="container" v-if="!isSignedInUserAdmin()">
    <h1 class="title">Login</h1>
    <h2 class="subtitle">This page is administrator only. Please login as an admin.</h2>
  </div>
  <div class="container" v-if="isSignedInUserAdmin()">
    <form id="formElement" v-if="formActive">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Add a User</p>
                <button @click="resetForm" class="delete" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <label class="label" for="name">Username</label>
                  <input type="text" class="input" id="username" v-model="formData.username" />
                </div>
                <div class="field">
                  <label class="label" for="date">First Name</label>
                  <input type="text" class="input" id="firstName" v-model="formData.firstName" />
                </div>
                <div class="field">
                  <label class="label" for="duration">Last Name</label>
                  <input type="text" class="input" id="lastName" v-model="formData.lastName" />
                </div>
                <div class="field">
                  <label class="label" for="distance">Email</label>
                  <input type="text" class="input" id="email" v-model="formData.email" />
                </div>
                <div class="field">
                  <label class="label" for="location">Is Admin</label>
                  <input type="checkbox" class="input" id="isAdmin" v-model="formData.isAdmin" />
                </div>
              </section>
              <footer class="modal-card-foot">
                <button @click="callAddActivity" class="button">Save changes</button>
                <button @click="resetForm" class="button">Cancel</button>
              </footer>
            </div>
          </div>
        </form>
    <div>

      <div>
        <button class="button is-primary" @click="formActive = !formActive">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add User</span>
        </button>
      </div>

      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Handle</th>
          <th>Is Admin</th>
          <th>Make Changes</th>
        </tr>
        <tr v-for="(user, index) in getUsersExcludingUserId(signedInUserId)" :key="index">          
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.isAdmin }}</td>
            <td>
              <button class="button"><i class="fas fa-edit"></i></button>
              <button class="button" @click="removeUser(user.userId)"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
      </table>
    </div>
  </div>
</template>
