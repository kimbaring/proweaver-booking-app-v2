<script setup>
import MasterLayoutVue from "../components/MasterLayout.vue";
import icons from '../assets/icons';
import {onMounted, ref} from 'vue';
import {axios} from '../functions'
import router from "../router";
let modal = ref({
  open:false,
  title: 'Add Location',
  placeholder: 'Enter Location',
  preference:'',
  id:''
});

let locations = ref([])
let services = ref([])
let workers = ref([])
let input = ref('')
let price = ref('')

onMounted(()=>{
  refetch();
})

function openModal(title,placeholder,preference='',id=''){
  modal.value = {open:true,title:title,placeholder:placeholder, preference:preference, id:id}
}

function refetch(){
  axios.post('location/fetch','default').then(res=>{
    if(!res.data.success) return;
    locations.value = res.data.result;
  })

  axios.post('services/fetch','default').then(res=>{
    if(!res.data.success) return;
    services.value = res.data.result;
  })

  axios.post('worker/fetch','default').then(res=>{
    if(!res.data.success) return;
    workers.value = res.data.result;
  })
}

function saveChanges(){
  let modalInfo = JSON.parse(JSON.stringify(modal.value))
  modal.value.open = false;
  switch(modalInfo.preference){
    case 'location': saveLocation(input.value,modalInfo.id); break;
    case 'services': saveService(input.value,price.value,modalInfo.id); break;
    case 'worker': saveWorker(input.value,modalInfo.id); break;
  }
  input.value = '';
  price.value = '';
  modal.value.id = '';
}

function saveLocation(value,id){
  let objToAdd = {book_location_name:value}
  if(['0',0,'',null].includes(price)) delete objToAdd.book_services_price;

  if(id=='') {
    axios.post('location/create',null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }else{
    axios.post('location/update?id='+id,null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
  });
  }
}

function saveWorker(value,id){
  let objToAdd = {book_worker_name:value}
  if(['0',0,'',null].includes(price)) delete objToAdd.book_services_price;

  if(id=='') {
    axios.post('worker/create',null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }else{
    axios.post('worker/update?id='+id,null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
  });
  }
}

function deleteItem(endpoint,id){
  if(!confirm('Are you sure you want to delete this item?')) return;
  console.log(endpoint+'/delete?id='+id)
  axios.post(endpoint+'/delete?id='+id,null).then(res=>{
    if(!res.data.success) return;
      router.go('/preferences')
  });
}

function saveService(value,price='',id=''){
  let objToAdd = {
      book_services_id:id,
      book_services_name:value,
      book_services_price:price
  }
  if(['0',0,'',null].includes(price)) delete objToAdd.book_services_price;
  delete objToAdd.book_services_id;

  if(id=='') {
    axios.post('services/create',null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }else{
    axios.post('services/update?id='+id,null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
  });
  }
  
}

</script>

<template>
  <!-- -z-10 opacity-0 -->
  <div id="modal_parent" class="transition w-screen h-screen fixed top-0 left-0" style="background: rgb(0,0,0,0.3);" :class="(modal.open) ? '' : 'opacity-0'" :style="modal.open ? 'z-index:999' :'z-index:-10'">
    <div id="modal_box" class="absolute max-w-[500px] w-10/12 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md">
      <div id="modal_header" class="p-5 bg-gray-900 rounded-md rounded-b-none text-white grid" style="grid-template-columns: 1fr 30px;">
        <h2 class="font-bold">{{modal.title}}</h2>
        <button class="transition hover:scale-105 active:scale-95" @click="modal.open = false;input = '';input='';price='';">&#10006;</button>
      </div>
      <form id="modal_body" class="p-5" @submit.prevent="saveChanges">
        <input class="border border-gray-300 w-full rounded-[3px] p-[5px] outline-none mb-2" :placeholder="modal.placeholder" required v-model="input">
        <input class="border border-gray-300 w-full rounded-[3px] p-[5px] outline-none mb-2" type="number" min="0" placeholder="Enter Service Price (e.g. $10) [optional]" v-if="modal.preference=='services'" v-model="price">
        <button class="transition hover:scale-105 active:scale-95 bg-green-700 text-white p-1.5 rounded-[3px] ml-auto mr-0 block" style="width: max-content;">Submit</button>
      </form>
    </div>
  </div>
  <MasterLayoutVue>
    <h1 class="text-3xl font-bold mb-4 border-b pb-3">Preferences</h1>
    <div id="main_grid" class="bg-white y-5 grid xl:grid-cols-2 grid-cols-1 gap-5 ">
      <div class="xl:border-r xl:pr-3"> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h1 class="text-lg font-bold">Locations</h1>
          <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openModal('Add Location', 'Enter Location','location')"><i class="block mr-1" v-html="icons.add"></i>Add</button>
        </div>
        <ul>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;" v-for="l,i in locations" :key="i">
            <p>{{ l.book_location_name }}</p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openModal('Edit Location', 'Enter Location Name','location',l.book_location_id);input=l.book_location_name;"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('location',l.book_location_id)"></i></button>
          </li>
        </ul>
      </div>
  
      <div class=""> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h1 class="text-lg font-bold">Workers</h1>
          <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openModal('Add Worker', 'Enter Worker','worker')"><i class="block mr-1" v-html="icons.add"></i>Add</button>
        </div>
        <ul>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;" v-for="w,i in workers" :key="i">
            <p>{{ w.book_worker_name }}</p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openModal('Edit Worker', 'Enter Worker Name','worker',w.book_worker_id);input=w.book_worker_name;"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('worker',w.book_worker_id)"></i></button>
          </li>
        </ul>
      </div>

      <div class=""> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h1 class="text-lg font-bold">Services</h1>
          <button class="flex items-center border p-[3px] rounded-md border-gray-400 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openModal('Add Services', 'Enter Services','services')"><i class="block mr-1" v-html="icons.add"></i>Add</button>
        </div>
        <ul>
          <li class="grid border m-1 py-1 px-2 rounded-[4px] border-gray-400" style="grid-template-columns: 1fr 30px 30px;" v-for="s,i in services" :key="i">
            <p>{{ s.book_services_name }} <span v-if="s.book_services_price" class="inline-block relative pl-3 ml-2 italic before:content-[''] before:bg-gray-900 before:w-1 before:h-1 before:absolute before:top-[10px] before:rounded-full before:left-0">${{ s.book_services_price }}</span></p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openModal('Edit Service', 'Enter Service','services',s.book_services_id);input=s.book_services_name;price=s.book_services_price"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('services',s.book_services_id)"></i></button>
          </li>
        </ul>
      </div>
    </div>
    
  </MasterLayoutVue>
</template>
