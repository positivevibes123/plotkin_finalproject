<script setup lang="ts">
import { ref } from 'vue'
import { addUser } from "../models/users"
import type { User } from "../models/users"
import { loginWithCredentials } from '../models/session'

const username = ref('')
const password = ref('')

function handleSubmit() {
    let loginData = {
        username: username.value,
        password: password.value
    }

    loginWithCredentials(loginData.username, loginData.password)
}

</script>

<template>
  <div class="container">
    <h1 class="title">Log in</h1>
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

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="handleSubmit()">Submit</button>
      </div>
    </div>

    <div class="field">
</div>
  </div>
</template>
