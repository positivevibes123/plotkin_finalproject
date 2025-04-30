<script setup lang="ts">
import { ref } from 'vue'
import { addUser } from "../models/users"
import type { User } from "../models/users"
import { loginWithID } from "../models/session"

const firstName = ref('')
const lastName = ref('')
const username = ref('')
const password = ref('')
const email = ref('')
const isAdmin = ref(false)

function handleSubmit() {
  let user: User = {
    firstname: firstName.value,
    lastname: lastName.value,
    username: username.value,
    password: password.value,
    email: email.value,
    isadmin: isAdmin.value
  }

  addUser(user).then((response) => {
    const addedUser = (response.data as unknown as Array<any>)[0];

    console.log("User added:", addedUser)

    loginWithID(addedUser.userid) 

    
  }).catch((error) => {
    console.error("Error adding user:", error)
  })
}

</script>

<template>
  <div class="container">
    <h1 class="title">Sign Up</h1>
    <div class="field">
      <label class="label">First Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="Text input" v-model="firstName"/>
      </div>
    </div>

    <div class="field">
      <label class="label">Last Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="Text input" v-model="lastName" />
      </div>
    </div>

    <div class="field">
      <label class="label">Username</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="text" placeholder="Text input" v-model="username" />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="text" placeholder="Text input" v-model="password" />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="email" placeholder="Email input" v-model="email" />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="handleSubmit()">Submit</button>
      </div>
    </div>

    <div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="isAdmin" />
      Is an Admin
    </label>
  </div>
</div>
  </div>
</template>
