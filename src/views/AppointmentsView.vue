<script setup>
import MasterLayoutVue from "../components/MasterLayout.vue";
import {onMounted, ref} from 'vue';
import {axios,dateFormat} from '../functions'
import icons from '../assets/icons';

let locations = ref(0)
let services = ref(0)
let workers = ref(0)
let dateSelect = ref(dateFormat('%y-%M-%D'));
let currentDate = ref('')

let appointments = ref([])
let modal = ref({
    open:false,
    info:{}
})

onMounted(()=>{
  fetchAppointments(dateFormat('%y-%M-%D'));
  fetchCount();
})

function changeStatus(id, status){
  if(!confirm(['Pending', 'Approve', 'Deny'][status] + ' this appointment?')) return;
  modal.value.open = false;
  axios.post('appointments/update?id='+id,null,{book_appointment_status:status}).then(res=>{
    if(!res.data.success) return;
    appointments.value[appointments.value.findIndex(el=>el.book_appointment_id == id)].book_appointment_status = status
  })
}

function fetchAppointments(date){
  if(date == '' || new Date(date).toDateString() == 'Invalid Date'){
    alert('Invalid Date Input')
    return;
  }

  if(date == ''){
    alert('Invalid Date Input')
    return;
  }
  

  axios.post('appointments/fetch?book_schedule_date='+date,'default').then(res=>{
    currentDate.value = date
    if(!res.data.success) {
      appointments.value = []
      return;
    }
    appointments.value = res.data.result
  })
}

function fetchCount(){
  axios.post('location/fetch','default').then(res=>{
    if(!res.data.success) return;
    locations.value = res.data.result.length;
  })

  axios.post('services/fetch','default').then(res=>{
    if(!res.data.success) return;
    services.value = res.data.result.length;
  })

  axios.post('worker/fetch','default').then(res=>{
    if(!res.data.success) return;
    workers.value = res.data.result.length;
  })
}

function parseJSON(mix){
  let schedule = {
    'Schedule ID' : mix.book_schedule_id,
    'Date' : dateFormat('%lm %d, %y',mix.book_schedule_date),
    'From' : dateFormat('%h:%I %a','2022-01-01 '+mix.book_schedule_timestart),
    'To' : dateFormat('%h:%I %a','2022-01-01 '+mix.book_schedule_timeend),
    'Description' : mix.book_schedule_description ?? '-',
  };


  return {
    appointment:JSON.parse(mix.book_appointment_custominputs),
    schedule:schedule,
    status: ['Pending', 'Approved', 'Denied'][mix.book_appointment_status]
  }
}

</script>

<template>
  <div id="modal_parent" class="transition w-screen h-screen fixed top-0 left-0" style="background: rgb(0,0,0,0.3);" :class="(modal.open) ? '' : 'opacity-0'" :style="modal.open ? 'z-index:999' :'z-index:-10'">
    <div id="modal_box" class=" absolute max-w-[500px]  bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md overflow-auto w-10/12" v-if="modal.open">
      <div id="modal_header" class="p-5 bg-gray-900 rounded-md rounded-b-none text-white grid min-w-[400px]" style="grid-template-columns: 1fr 30px;">
        <h2 class="font-bold">View Appointment</h2>
        <button class="transition hover:scale-105 active:scale-95" @click="modal.open = false;">&#10006;</button>
      </div>
        <div id="modal_body" class="p-5 min-w-[400px]" @submit.prevent="saveChanges" style="max-height: 70vh;">
          <h2 class="text-lg font-bold text-gray-800 mb-2">Schedule Details</h2>
          <table class="w-full border">
            <tr v-for="f,i in parseJSON(modal.info).schedule" :key="i" class="border-b">
              <td class="font-bold text-gray-800 border-b p-1">{{ i }}</td>
              <td class="border-b p-1">{{ f }}</td>
            </tr>
          </table>
          <h2 class="text-lg font-bold text-gray-800 mb-2 mt-4">Appointment Details</h2>
          <table class="w-full border">
            <tr>
              <td class="font-bold text-gray-800 border-b p-1">Status</td>
              <td class="border-b p-1">{{ parseJSON(modal.info).status }}</td>
            </tr>

            <tr v-for="f,i in parseJSON(modal.info).appointment" :key="i" class="border-b" v-show="f.field != 'Pick_A_Schedule'">
              <td class="font-bold text-gray-800 border-b p-1">{{ f.field.replaceAll('_',' ') }}</td>
              <td class="border-b p-1">{{ [0,'','undefined',null,undefined].includes(f.value) ? '-' : f.value }}</td>
            </tr>
          </table>
          <div class="flex justify-end my-5">
            <button v-if="[0,2,'0','2'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-end rounded-md w-[100px] text-white bg-green-700 mx-[4px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,1)"><i class="text-base w-[20px] h-[20px] object-contain" v-html="icons.thumbsUp" ></i> Approve</button>
            <button v-if="[0,1,'0','1'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-center rounded-md w-[100px] text-white bg-red-700 mx-[2px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,2)"><i class="text-base w-[20px] h-[20px] object-contain" v-html="icons.thumbsDown" ></i> Deny</button>
          </div>
          
        </div>
    </div>
  </div>
  <MasterLayoutVue>
    <h1 class="text-3xl font-bold border-b pb-3 mb-3 flex items-end">Appointments <small class="text-lg border-l pl-2 border-gray-700 ml-2 border-l-2">{{dateFormat('%lm %d, %y',currentDate)}}</small></h1>
    Date: 
    <input type="date" class=" mx-2 border p-1 border-gray-300 rounded-md" v-model="dateSelect">
    <button class="transition rounded-md bg-gray-900 text-white px-2 py-1 hover:scale-105 active:scale-95" @click="fetchAppointments(dateSelect)">Go</button>

    <p class="mt-4 text-center border border-gray-300 p-3 italic rounded-md" v-if="appointments.length == 0">No appointment requests scheduled on this date...</p>
    <table class="w-full border-separate border-spacing-y-2 border-spacing-x-0" v-if="appointments.length > 0">
      <tr>
        <td class="font-bold p-2" v-if="services
         > 0">Service</td>
        <td class="font-bold p-2" v-if="locations
         > 0">Location</td>
        <td class="font-bold p-2">Customer Name</td>
        <td class="font-bold p-2">Time</td>
        <td class="font-bold p-2">Status</td>
        <td class="font-bold p-2">Action</td>
      </tr>
      <tr v-for="a,i in appointments" :key="i" style="box-shadow: 0 0 2px #999;" class="rounded-md hover:scale-[101%] transition hover:shadow-sm hover:bg-blue-100">
        <td class="p-2" v-if="services
         > 0"> {{ [0,null,'undefined',''].includes(a.book_appointment_servicesname) ? '-' : a.book_appointment_servicesname }}</td>
        <td class="p-2" v-if="locations
         > 0"> {{ [0,null,'undefined',''].includes(a.book_appointment_locationname) ? '-' : a.book_appointment_locationname }}</td>
        <td class="p-2"> {{ [0,null,'undefined',''].includes(a.book_appointment_name) ? '-' : a.book_appointment_name }}</td>
        <td>{{dateFormat('%h:%I %a','2022-01-01 '+a.book_schedule_timestart)}} - {{dateFormat('%h:%I %a','2022-01-01 '+a.book_schedule_timeend)}}</td>
        <td>{{['Pending', 'Approved', 'Denied'][a.book_appointment_status]}}</td>
        <td class="flex items-center h-full p-2">
          <button v-if="[0,2,'0','2'].includes(a.book_appointment_status)" @click="changeStatus(a.book_appointment_id,1)" class="transition rounded-md text-white bg-green-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95"><i class="text-base" v-html="icons.thumbsUp"></i></button>
          <button v-if="[0,1,'0','1'].includes(a.book_appointment_status)" @click="changeStatus(a.book_appointment_id,2)" class="transition rounded-md text-white bg-red-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95"><i class="text-base" v-html="icons.thumbsDown"></i></button>
          <button class="transition rounded-md text-white bg-gray-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95" @click="modal.info = a;modal.open= true;"><i class="text-base" v-html="icons.eye" ></i></button>
        </td>
      </tr>
    </table>
  </MasterLayoutVue>
</template>
