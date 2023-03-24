<script setup>
import MasterLayoutVue from "../components/MasterLayout.vue";
import FormView from './FormView.vue'
import {formData} from '../defaults'
import CustomField from '../components/SchedulerComps/CustomField.vue'
import {ref,computed,watch} from 'vue'
import {hexToHsl} from '../functions'

let form = ref(formData)
let currentPageIndex = ref(0)
let formRefresh = ref(false)
const currentPage = computed(()=>{
    return form.value.pages[currentPageIndex.value]
});

const pagesSelect = computed(()=>{
    let parsed = form.value.pages.map((el,i)=>{
      return {
        label: el.page_title,
        value: i
      }
    });
    parsed.push({label:'Add New Page (+)',value:-1})
    return parsed;
});
function consoleLog(text){
  console.log(text)
}

watch(()=>form.value,()=>refreshForm(),{deep:true})

function refreshForm(){
    formRefresh.value = true;
    console.log('test')
    setTimeout(()=>formRefresh.value=false,1)
}



</script>

<template>
  <MasterLayoutVue>
    <h1 class="text-3xl font-bold border-b pb-3">Form Builder</h1>
    <div id="main_grid" class="grid gap-3 bg-gray-100 h-full mt-5" style="grid-template-columns: 400px 1fr;grid-template-rows: 70px 1fr;">
      <div class="col-span-2 p-3 bg-white shadow-md flex gap-3"> <!-- builder header -->
        <div class="flex gap-2 items-center">
          Form Title
          <CustomField
            name="pwfb-formtitle"
            :value="form.form_title"
            @onResult="e=>form.form_title = e"
            placeholder="e.g. Book Form"
          />
          <div class="flex gap-2 items-center">
            Select Page
            <CustomField
            type="select"
            value=""
            :values="pagesSelect"
            name="pwfb-pageselect"
            placeholder="e.g. Book Form"
            :styles="{input: 'p-[5px] border-none'}"
          />
          </div>
          <div>
            <button class="bg-green-600 p-2 text-white rounded-md mr-2 hover:scale-105 active:scale-95 transition">Save Changes</button>
            <button class="bg-red-600 p-2 text-white rounded-md hover:scale-105 active:scale-95 transition">Cancel</button>
          </div>
        </div>
      </div><!-- /builder header -->

      <div class="shadow-md p-5 bg-white"> <!-- builder aside -->
        <h2 for="pwfb-pagecolumns" class="mb-2 mt-5 block font-bold text-gray-700 text-lg">Form </h2>
        <label for="pwfb-formcolor" class="mb-2 block">Accent Color</label>
        <input type="color" class="w-full rounded-md overflow-hidden p-2" id="pwfb-formcolor" :value="form.design.primaryColor" @change="form.design.primaryColor = $event.target.value">
        <label for="pwfb-formnavplacement" class="mb-2 block mt-3">Navigation Placement</label>
        <CustomField
          name="pwfb-formnavplacement"
          type="radio-group"
          placeholder="e.g. Book Form"
          columns="1fr 1fr"
          :values="[
            {label:'Top',value:'column'},
            {label:'Left',value:'row'}
          ]"
          :value="form.design.pagenavDesign"
          @onResult="e=>{form.design.pagenavDesign = e;}"
        />
        <h2 for="pwfb-pagecolumns" class="mb-2 mt-5 block font-bold text-gray-700 text-lg">Page Settings</h2>
        <label for="pwfb-pagetitle" class="mb-2 block">Page Title</label>
        <CustomField
          name="pwfb-pagetitle"
          :value="currentPage.page_title"
          placeholder="e.g. Pick Your Schedule"
          :styles="{input: 'p-[5px] border-none'}"
        />
        <label for="pwfb-pagecolumns" class="mb-2 mt-3 block">Columns</label>
        <CustomField
          name="pwfb-pagecolumns"
          type="radio-group"
          placeholder="e.g. Book Form"
          columns="1fr 1fr"
          :values="[
              {label:'1',value:1},
              {label:'2',value:2}
          ]"
          :value="currentPage.page_columns"
          @onResult="e=>{currentPage.page_columns = e;}"
        />
        <label for="pwfb-pagecolumns" class="mb-2 mt-3 block">Required To Proceed</label>
        <CustomField
          name="pwfb-pagerequiredfields"
          type="checkbox-group"
          value=""
          placeholder="e.g. Book Form"
          :styles="{grid:'grid-cols-[1fr]',checkboxGrp: 'p-[5px] border-none'}"
          :values="[
              {label:'1',value:1},
              {label:'2',value:2}
          ]"
        />
        <h2 for="pwfb-pagecolumns" class="mb-2 mt-5 block font-bold text-gray-700 text-lg">Fields</h2>
      </div> <!-- builder aside -->
      <div> <!-- builder aside -->
        <form-view v-if="!formRefresh" class="" :form="form"></form-view>
      </div> <!-- builder aside -->
    </div>
    
  </MasterLayoutVue>
</template>
