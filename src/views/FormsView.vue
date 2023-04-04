<script setup>
import {axios,dateFormat} from "../functions";
import router from "../router";
import icons from '../assets/icons'
import MasterLayoutVue from "../components/MasterLayout.vue";
import { onMounted, ref } from 'vue';

let forms = ref([])
onMounted(()=>{
    axios.post('forms/fetchLight').then(res=>{
        forms.value = [];
        if(res.data == null || !res.data.success) return;
        forms.value = res.data.result
    })
})

function go(url){
    window.location.assign(url)
}

function deleteForm(id){
    if(!confirm('This action cannot be undone. Continue?')) return;
    axios.post('forms/delete?id='+id).then(res=>{
        window.location.reload();
    });
}

</script>
<template>
    <MasterLayoutVue>
        <h1 class="text-3xl font-bold mb-4 border-b pb-3">Forms</h1>
        <p class="text-center m-2 italic" v-if="forms.length == 0">No forms created yet...</p>
        <ul>
          <li class="grid border my-1 py-1 px-2 rounded-[4px] border-gray-400 relative" style="grid-template-columns: 1fr 30px 30px;" v-for="f,i in forms" :key="i">
            <p>{{f.book_form_name}} <span class="inline-block relative pl-3 ml-2 text-sm before:content-[''] before:bg-gray-900 before:w-1 before:h-1 before:absolute before:top-[10px] before:rounded-full before:left-0">Created: {{ dateFormat('%lm %d, %y',f.book_form_created) }}</span></p>
            <button class="hover:scale-105 active:scale-95 transition" @click="go('/form-builder?form_id='+f.book_form_id)"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition" @click="deleteForm(f.book_form_id)"><i v-html="icons.trash" @click=""></i></button>
          </li>
        </ul>
        <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="router.push('/form-builder')"><i class="block mr-1" v-html="icons.add"></i>New Form</button>
    </MasterLayoutVue>
</template>