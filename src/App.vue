<template>
  <div id="app">
    <screen></screen>
    <keyboard></keyboard>
  </div>
</template>

<script>
import Screen from './components/Screen'
import Keyboard from './components/Keyboard'

export default {
  name: 'app',
  components: {
    Screen,Keyboard
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
