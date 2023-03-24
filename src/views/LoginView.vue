<script setup>
import { ref } from 'vue';
import icons from '../assets/icons';

let showPassword = ref(false)




</script>


<template>
  <div id="login_cont" class="h-screen text-gray-800">
    <form @submit.prevent class="max-w-[500px] absolute w-full bg-white px-10 py-10 text-center rounded-lg shadow-md top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4">
      <h2 class="  text-xl mb-10">
        <img src="../assets/logo.png" class="block mx-auto my-3">
        Booking App Admin
      </h2>
      <label class="shadow-md block border border-gray-300 bg-gray-50 mb-2 rounded-md overflow-hidden">
        <input class="outline-none block w-full h-full p-2" placeholder="Username">
      </label>
      <label class="shadow-md block border border-gray-300 bg-gray-50 rounded-md overflow-hidden relative mb-3">
        <input class="outline-none block w-full h-full p-2" placeholder="Password" :type="showPassword ? 'text':'password'"> 
        <i v-html="showPassword ? icons.eyeSlash : icons.eye" class="absolute right-2 top-[50%] translate-y-[-50%]" @click="showPassword = !showPassword
        "></i>
      </label>
      <button class="transition bg-[#fd3c32] w-full block p-2 text-white rounded-md shadow-md hover:scale-105 active:scale-95">Submit</button>
    </form>
  </div>
</template>

<style scoped>
#login_cont{
  background-color: #dddddd;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23fd3c32' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>
