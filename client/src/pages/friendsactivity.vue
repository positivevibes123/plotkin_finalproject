<script setup lang="ts">
import { refSignedInUserId } from '@/models/users';
import { getActivitiesExcludingUserId } from '@/models/users';
import { getFullName } from '@/models/users';

const signedInUserId = refSignedInUserId()

</script>

<template>
  <div class="container" v-if="signedInUserId === 0">
    <h1 class="title">Login</h1>
    <h2 class="subtitle">Please select a user to login</h2>
  </div>
  <div class="container" v-if = "signedInUserId > 0">
    <h1 class="title">Friends Activity</h1>
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <li v-for="(item, index) in getActivitiesExcludingUserId(signedInUserId)" :key="index">
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
            </article>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
