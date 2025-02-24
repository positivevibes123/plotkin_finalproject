<script>
import Home from './pages/Home.vue'
import NavBar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Home,
    NavBar
  }
}
</script>

<template>
  <NavBar/>
  <Home/>
</template>