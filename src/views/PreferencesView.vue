<script setup>
import MasterLayoutVue from "../components/MasterLayout.vue";
import icons from '../assets/icons';
</script>

<template>
  <MasterLayoutVue>
    <h1 class="text-3xl font-bold mb-4 border-b pb-3">Preferences</h1>
    <div id="main_grid" class="bg-white y-5 grid xl:grid-cols-3 gap-5 grid-cols-2">
      <div class="xl:border-r xl:pr-3"> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h1 class="text-lg font-bold">Location</h1>
          <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition"><i class="block mr-1" v-html="icons.add"></i>Add</button>
        </div>
        <ul>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Keppel Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Argao Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Plaridel Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
        </ul>
      </div>
  
      <div class="xl:border-r xl:pr-3 "> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h1 class="text-lg font-bold">Workers</h1>
          <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition"><i class="block mr-1" v-html="icons.add"></i>Add</button>
        </div>
        <ul>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Keppel Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Argao Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Plaridel Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
        </ul>
      </div>

      <div class="xl:col-span-1 col-span-3"> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h1 class="text-lg font-bold">Services</h1>
          <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition"><i class="block mr-1" v-html="icons.add"></i>Add</button>
        </div>
        <ul>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Keppel Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Argao Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;">Plaridel Hub
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash"></i></button>
          </li>
        </ul>
      </div>
    </div>
    
  </MasterLayoutVue>
</template>
