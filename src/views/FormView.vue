<script setup>
import {onMounted, ref,watch,computed} from 'vue'
import TemplatedFields from '../components/TemplatedFields.vue'
import {formData,formCSS} from '../defaults'
import icons from '../assets/icons'
import SchedulerSelect from '../components/SchedulerSelect.vue'
import RequestBindedFields from '../components/RequestBindedFields.vue'

let props = defineProps({
    form:{default:formData,type:Object},
    page:{default:0,type:Number}
})

let form = ref(props.form)

let currentPageIndex = ref(0)
let progressIndex = ref(0);
let formElement = ref(null)
let userInput = ref([]);
let requiredFields = ref([]);
let currentPageRequired = ref([]);
let currentPageRequiredLabels = ref([]);
let currentPageRequiredInvalids = ref([]);
let newStyle = document.createElement('style');
newStyle.id = "pwfv-customcss";
newStyle.textContent = props.form.design.css ?? formCSS(props.form.design.primaryColor,props.form.design.pagenavDesign)
const currentPage = computed(()=>{
    return form.value.pages[currentPageIndex.value]
});


watch(()=>currentPageIndex.value,()=>{
    currentPageRequired.value = []

})

function filteredByColumn(col){
    if(currentPage.value.page_columns == 1 && col ==1) return currentPage.value.page_fields
    else if (currentPage.value.page_columns == 1 && col ==2) return [];
    else return currentPage.value.page_fields.filter(el=>el.column == col) 
}

function getId(id,order){
    return `pwp${currentPageIndex.value}_pwo${order}_${id}`
}

function getFieldValue(id){
    let index = userInput.value.findIndex(el=>el.id == id);
    if(index == -1) return null;
    return userInput.value[index].value
}

function organizeInput(id,fieldLabel,fieldValue,order){
    let fieldId = `pwp${currentPageIndex.value}_pwo${order}_${id}`
    let index = userInput.value.findIndex(el=>el.id == fieldId);
    if(index == -1){
        userInput.value.push({
            id:fieldId,
            label: fieldLabel,
            value: fieldValue
        })
        return;
    }

    userInput.value[index] = {
        id:fieldId,
        label: fieldLabel,
        value: fieldValue
    }
}

function fieldLoaded(id,label){
    let index = currentPageRequired.value.indexOf(id);
    if(index >= 0) return;
    requiredFields.value.push({id,label});
    currentPageRequired.value.push(id);
    currentPageRequiredLabels.value.push(label);
}

onMounted(()=>{
    if(props.page != 0) currentPageIndex.value = props.page;
    if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
    document.body.appendChild(newStyle)
})


function beforePageChange(add,jumpTo=null){
    currentPageRequiredInvalids.value = [];
    currentPageRequired.value.forEach((el,i)=>{
        let index = userInput.value.findIndex(el2=>el2.id == el && !['',null].includes(el2.value));
        if(index == -1) 
            currentPageRequiredInvalids.value.push({
                id: el,
                label: currentPageRequiredLabels.value[i]
            })
    })
    if(currentPageRequiredInvalids.value.length > 0) return;
    if(jumpTo != null){
        if(jumpTo > progressIndex.value+1) return;
        currentPageIndex.value = jumpTo;
        return;
    }

    if(currentPageIndex.value + add > progressIndex.value+1) return;
    currentPageIndex.value+=add;
}

function submit(){
    currentPageRequiredInvalids.value = [];
    requiredFields.value.forEach(el=>{
        let index = userInput.value.findIndex(el2=>el2.id == el.id && !['',null].includes(el2.value));
        if(index == -1) 
            currentPageRequiredInvalids.value.push({
                id: el.id,
                label: el.label
            })
    })


}


</script>
<template>
   <div id="pwfv-parent" ref="formElement">
        <div class="pwfv-header">
            {{ form.form_title }}
        </div>
        <div class="pwfv-body">
            <div class="pwfv-navigation" v-if="form.pages.length > 1">
                <div class="pwfv-navigation-item" :class="{active:currentPageIndex == i,done:currentPageIndex > i}" v-for="p,i in form.pages" :key="i" @click="beforePageChange(null,i)">
                    <span>{{currentPageIndex > i ? '&check;' : i+1}}</span>
                    {{ p.page_title }}
                </div>
            </div>
            <div class="pwfv-maingrid " :class="{'two-cols':currentPage.page_columns == 2}">
                <div class="pwfv-maingrid-1">
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(1)" :key="i">
                        <!-- field renderer start-->
                        <div v-if="f.content_type == 'rbfield'">
                            {{ fieldLoaded(getId('pwid='+f.endpoint.split('/')[0],i),f.text)}}
                            <label>{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                
                                :value="getFieldValue(getId('pwid='+f.endpoint.split('/')[0],i))"
                                @onResult="e=>organizeInput('pwid='+f.endpoint.split('/')[0],f.text,e,i)"
                            />
                        </div>
                        <div v-if="f.content_type == 'scheduler'">
                            {{ fieldLoaded(getId('pwid=scheduler',i),f.text)}}
                            <label>{{ f.text }} <span>*</span></label>
                            <SchedulerSelect
                                :schedule="getFieldValue(getId('pwid=scheduler',i))"
                                @onResult="e=>organizeInput('pwid=scheduler',f.text,e,i)"
                            />
                        </div>
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field' && f.type != 'checkbox'">
                            {{ f.required ? fieldLoaded(getId(f.name,i),f.label) : ''}}
                            <label>{{ f.label }} <span v-if="f.required">*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(getId(f.name,i)) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(getId(f.name,i))"
                            @onResult="e=>organizeInput(f.name,f.label,e,i)"
                            />
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'checkbox'">
                            {{ f.required ? fieldLoaded(getId(f.name,i),f.label) : ''}}
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(getId(f.name,i)) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(getId(f.name,i))"
                            @onResult="e=>organizeInput(f.name,f.label,e,i)"
                            />
                            <label :for="f.name" class="pwfvf-checkbox-label">{{ f.label }} <span v-if="f.required">*</span></label>
                        </div>
                        <!-- field renderer end-->
                    </div>
                </div>
                <div class="pwfv-maingrid-2" v-if="currentPage.page_columns == 2">
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(2)" :key="i">
                        <!-- field renderer start-->
                        <div v-if="f.content_type == 'rbfield'">
                            {{ fieldLoaded(getId('pwid='+f.endpoint.split('/')[0],i),f.text)}}
                            <label>{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                
                                :value="getFieldValue(getId('pwid='+f.endpoint.split('/')[0],i))"
                                @onResult="e=>organizeInput('pwid='+f.endpoint.split('/')[0],f.text,e,i)"
                            />
                        </div>
                        <div v-if="f.content_type == 'scheduler'">
                            {{ fieldLoaded(getId('pwid=scheduler',i),f.text) }}
                            <label>{{ f.text }} <span>*</span></label>
                            <SchedulerSelect
                                :schedule="getFieldValue(getId('pwid=scheduler'))"
                                @onResult="e=>organizeInput('pwid=scheduler',f.text,e,i)"
                            />
                        </div>
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field' && f.type != 'checkbox'">
                            {{ f.required ? fieldLoaded(getId(f.name,i),f.label) : ''}}
                            <label>{{ f.label }} <span v-if="f.required">*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(getId(f.name,i)) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(getId(f.name,i))"
                            @onResult="e=>organizeInput(f.name,f.label,e,i)"
                            />
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'checkbox'">
                            {{ f.required ? fieldLoaded(getId(f.name,i),f.label) : ''}}
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(getId(f.name,i)) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(getId(f.name,i))"
                            @onResult="e=>organizeInput(f.name,f.label,e,i)"
                            />
                            <label :for="f.name" class="pwfvf-checkbox-label">{{ f.label }} <span v-if="f.required">*</span></label>
                        </div>
                        <!-- field renderer end-->
                    </div>
                </div>
                <div class="pwfv-errormsg" v-if="currentPageRequiredInvalids.length > 0">
                    The following field/s are required before you proceed:
                    <strong v-for="cpri,i in currentPageRequiredInvalids">
                        {{ cpri.label }}{{ i != currentPageRequiredInvalids.length - 1 ? ', ' : ' ' }}
                    </strong>
                </div>
                <div class="pwfv-finalfields">
                    <button @click="beforePageChange(-1)" v-if="currentPageIndex != 0"><i v-html="icons.arrowLeft"></i> Prev</button>
                    <button @click="beforePageChange(1)" v-if="currentPageIndex != form.pages.length -1">Next <i v-html="icons.arrowRight"></i></button>
                    <button @click="submit()" v-if="currentPageIndex == form.pages.length -1 " class="pwfv-submit">Submit</button>
                </div>
            </div>
        </div>
   </div>
</template>
<style scoped>

</style>