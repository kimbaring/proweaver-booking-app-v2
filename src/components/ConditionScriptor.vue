<script setup>
import icons from '../assets/icons';

</script>


<template>
    
<div class="grid grid-cols-2 p-1">
    <div class="border-b border-r p-1">
        <button class="transition flex items-center hover:scale-105 active:scale-95"><i v-html="icons.add" class="inline-block mr-1"></i>Add Condition</button>
    </div>
    <div class="flex items-center border-b p-1">
        <button class="transition flex items-center hover:scale-105 active:scale-95"><i v-html="icons.add" class="inline-block mr-1"></i>Add Effect</button>
    </div>
</div>    
</template>