<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Home from './pages/index.vue'
import NavBar from './components/Navbar.vue';
</script>

<template>
<NavBar/>
<RouterView/>
</template>