<script setup>
import {onMounted, ref,watch,computed} from 'vue'
import TemplatedFields from '../components/TemplatedFields.vue'
import {formData} from '../defaults'

import {formCSS} from '../defaults'

let props = defineProps({
    form:{default:formData,type:Object}
})

let form = ref(props.form)

let currentPageIndex = ref(0)
let formElement = ref(null)
let newStyle = document.createElement('style');
newStyle.id = "pwfv-customcss";
newStyle.textContent = formCSS(props.form.design.primaryColor,props.form.design.pagenavDesign)
const currentPage = computed(()=>{
    return form.value.pages[currentPageIndex.value]
});

function filteredByColumn(col){
    if(currentPage.value.page_columns == 1 && col ==1) return currentPage.value.page_fields
    else if (currentPage.value.page_columns == 1 && col ==2) return [];
    else return currentPage.value.page_fields.filter(el=>el.column == col) 
}



onMounted(()=>{
    if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
    document.body.appendChild(newStyle)
})


</script>
<template>
   <div id="pwfv-parent" ref="formElement">
        <div class="pwfv-header">
            {{ form.form_title }}
        </div>
        <div class="pwfv-body">
            <div class="pwfv-navigation">
                <div class="pwfv-navigation-item" :class="{active:currentPageIndex == i,done:currentPageIndex > i}" v-for="p,i in form.pages" :key="i" @click="currentPageIndex = i">
                    <span>{{currentPageIndex > i ? '&check;' : i+1}}</span>
                    {{ p.page_title }}
                </div>
            </div>
            <div class="pwfv-maingrid">
                <div class="pwfv-maingrid-1">
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(1)" :key="i">
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles">
                        </div>
                        <div v-if="f.content_type == 'field'">
                            <label>{{ f.label }} <span>*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :value="f.value"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.select"
                            :options="f.options"
                            :index="f.index"
                            />
                        </div>
                    </div>
                </div>
                <div class="pwfv-maingrid-2" v-if="currentPage.page_columns == 2">
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(2)" :key="i">
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles">
                        </div>
                        <div v-if="f.content_type == 'field'">
                            <label>{{ f.label }} <span>*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :value="f.value"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.select"
                            :options="f.options"
                            :index="f.index"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </div>
</template>
<style scoped>

</style>