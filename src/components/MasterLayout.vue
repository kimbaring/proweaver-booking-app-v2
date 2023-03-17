<script setup>
import icons from '../assets/icons';
</script>

<template>
    <div id="app-parent" class="flex content-start flex-wrap h-screen">
        <header class="p-3 bg-gray-900 w-full flex items-center gap-5 text-white">
            <h2 class="text-2xl font-bold text-white">Proweaver Booking App</h2>
            <button class="transition bg-gray-700 rounded-md hover:scale-105 active:scale-95">
                <i class="block p-2" v-html="icons.menu2"></i>
            </button>
        </header>
        <aside style="height: calc(100vh - 64px);" class="w-[300px] bg-gray-100">
            <ul>
                <li><RouterLink to="/" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white"><i class="block mr-3" v-html="icons.home"></i>Dashboard</RouterLink></li>
                <li><RouterLink to="/scheduler" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white"><i class="block mr-3" v-html="icons.calendar"></i>Scheduler</RouterLink></li>
                <li><RouterLink to="/appointments" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white"><i class="block mr-3" v-html="icons.que"></i>Appointments</RouterLink></li>
                <li><RouterLink to="/form-builder" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white"><i class="block mr-3" v-html="icons.wrench"></i>Form Builder</RouterLink></li>
                <li><RouterLink to="/preferences" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white"><i class="block mr-3" v-html="icons.gear"></i>Preferences</RouterLink></li>
                <li><RouterLink to="/" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white"><i class="block mr-3" v-html="icons.logout"></i>Log Out</RouterLink></li>
            </ul>
        </aside>
        <div id="main_content" class="p-5 text-gray-900" style="height: calc(100vh - 72px);width: calc(100% - 300px);">
            <slot />
        </div>
    </div>
</template>
