<script setup>
import {onMounted, ref,watch,computed} from 'vue'
import {axios} from '../functions'
import TemplatedFields from '../components/TemplatedFields.vue'
import {formData,formCSS} from '../defaults'
import icons from '../assets/icons'
import SchedulerSelect from '../components/SchedulerSelect.vue'
import RequestBindedFields from '../components/RequestBindedFields.vue'

let props = defineProps({
    form:{type:Object},
    page:{default:0,type:Number}
})

let form = ref(null)

let currentPageIndex = ref(0)
let progressIndex = ref(0);
let formElement = ref(null)
let userInput = ref([]);
let requiredFields = ref([]);
let currentPageRequired = ref([]);
let currentPageRequiredLabels = ref([]);
let currentPageRequiredInvalids = ref([]);
let omittedRBFields = ref([]);
let pageColumnResponsive = ref(1);
const currentPage = computed(()=>{
    pageColumnResponsive.value = form.value.pages[currentPageIndex.value].page_columns;
    return form.value.pages[currentPageIndex.value]
});


watch(()=>currentPageIndex.value,()=>{
    currentPageRequired.value = []
})


function checkGetter(){
    let getparams = new URLSearchParams(window.location.search);
    if(getparams.get('form_id') == null || props.form != null) {
        if(props.form == null) form.value = formData;
        else form.value = props.form
        console.log(form.value)
        let newStyle = document.createElement('style');
        newStyle.id = "pwfv-customcss";
        newStyle.textContent = form.value.design.css ?? formCSS(form.value.design.primaryColor,form.value.design.pagenavDesign)
        if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
        document.body.appendChild(newStyle)
        window.onresize = ()=>checkResponsive()
        checkResponsive()
        return;
    }
    let id = getparams.get('form_id');
    axios.post('forms/fetch?book_form_id='+id).then(res=>{
        if(res.data == null || !res.data.success) return;
        form.value = JSON.parse(res.data.result[0].book_form_json)
        let newStyle = document.createElement('style');
        newStyle.id = "pwfv-customcss";
        newStyle.textContent = form.value.design.css ?? formCSS(form.value.design.primaryColor,form.value.design.pagenavDesign)
        if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
        document.body.appendChild(newStyle)
        window.onresize = ()=>checkResponsive()
        checkResponsive()
    });
}


function filteredByColumn(col){
    if(pageColumnResponsive.value == 1 && col ==1) return currentPage.value.page_fields
    else if (pageColumnResponsive.value == 1 && col ==2) return [];
    else return currentPage.value.page_fields.filter(el=>el.column == col) 
}

function getId(id,order){
    return `pwp${currentPageIndex.value}_pwo${order}_${id}`
}

function deleteRBField(id,order){
    let index = currentPageRequired.value.findIndex(el=>el ==`pwp${currentPageIndex.value}_pwo${order}_${id}`)
    requiredFields.value.splice(requiredFields.value.findIndex(el=>el.id==`pwp${currentPageIndex.value}_pwo${order}_${id}`), 1)
    currentPageRequired.value.splice(index,1);
    currentPageRequiredLabels.value.splice(index,1);
    omittedRBFields.value.push(`pwp${currentPageIndex.value}_pwo${order}_${id}`)
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
    checkGetter()
    if(props.page != 0) currentPageIndex.value = props.page;
})


function beforePageChange(add,jumpTo=null){
    currentPageRequiredInvalids.value = [];
    if(currentPageRequired.value.length > 0 && (add >= 1 || (jumpTo != null && jumpTo > currentPageIndex.value)) ){
        currentPageRequired.value.forEach((el,i)=>{
            let index = userInput.value.findIndex(el2=>{
                if(typeof el2.value == 'object') el2.value = JSON.parse(JSON.stringify(el2.value));
                return el2.id == el && !['',null,[]].includes(el2.value)
            });
            if(index == -1) 
                currentPageRequiredInvalids.value.push({
                    id: el,
                    label: currentPageRequiredLabels.value[i]
                })
        })
        if(currentPageRequiredInvalids.value.length > 0) return;
    }
    
    if(jumpTo != null){
        if(jumpTo > progressIndex.value+1) return;
        currentPageIndex.value = jumpTo;
        if(currentPageIndex.value > progressIndex.value) progressIndex.value = currentPageIndex.value;
        return;
    }
    
    if(currentPageIndex.value + add > progressIndex.value+1) return;
    currentPageIndex.value+=add;
    if(currentPageIndex.value > progressIndex.value) progressIndex.value = currentPageIndex.value;
}

function submit(){
    console.log(requiredFields.value,userInput.value)
    currentPageRequiredInvalids.value = [];
    requiredFields.value.forEach(el=>{
        let index = userInput.value.findIndex(el2=>{
            if(el2.id == el.id && el2.value != null && typeof el2.value == 'object') return el2.value.length > 0;
            return el2.id == el.id && !['',null,[]].includes(el2.value)
        });
        if(index == -1) 
            currentPageRequiredInvalids.value.push({
                id: el.id,
                label: el.label
            })
    })
    console.log(currentPageRequiredInvalids.value);
}



async function checkResponsive(){
    pageColumnResponsive.value = currentPage.value.page_columns
    if(document.getElementById('pwfv-parent') == null){
        let parentChecker =  setInterval(()=>{
            if(document.getElementById('pwfv-parent') == null) return;
            clearInterval(parentChecker);
            document.getElementById('pwfv-parent').dataset.responsive=""
            if(document.getElementById('pwfv-parent').offsetWidth < 600)
                document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "600 ";
            if(document.getElementById('pwfv-parent').offsetWidth < 800){
                document.getElementById('pwfv-parent').dataset.responsive= document.getElementById('pwfv-parent').dataset.responsive + "800 ";
                pageColumnResponsive.value = 1;
            }
            if(document.getElementById('pwfv-parent').offsetWidth < 1000)
                document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "1000 ";
            
        },100)
        return;
    }
    document.getElementById('pwfv-parent').dataset.responsive=""
    if(document.getElementById('pwfv-parent').offsetWidth < 600)
        document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "600 ";
    if(document.getElementById('pwfv-parent').offsetWidth < 800){
        document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "800 ";
        pageColumnResponsive.value = 1;
    }
    if(document.getElementById('pwfv-parent').offsetWidth < 1000)
        document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "1000 ";
}


</script>
<template>
   <div id="pwfv-parent" ref="formElement" v-if="form != null" data-responsive="">
        <div class="pwfv-header">
            {{ form.form_title }}
        </div>
        <div class="pwfv-body">
            <div class="pwfv-navigation" v-if="form.pages.length > 1">
                <div class="pwfv-navigation-item" :class="{active:currentPageIndex == i,done:progressIndex > i}" v-for="p,i in form.pages" :key="i" @click="beforePageChange(null,i)">
                    <span>{{progressIndex > i ? '&check;' : i+1}}</span>
                    {{ p.page_title }}
                </div>
            </div>
            <div class="pwfv-maingrid " :class="{'two-cols':currentPage.page_columns == 2}">
                <div class="pwfv-maingrid-1">
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(1)" :key="i">
                        <!-- field renderer start-->
                        <div v-if="f.content_type == 'rbfield' && !omittedRBFields.includes(getId('pwid='+f.endpoint.split('/')[0],i))">
                            {{ fieldLoaded(getId('pwid='+f.endpoint.split('/')[0],i),f.text)}}
                            <label>{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                :value="getFieldValue(getId('pwid='+f.endpoint.split('/')[0],i))"
                                @onResult="e=>organizeInput('pwid='+f.endpoint.split('/')[0],f.text,e,i)"
                                @onEmpty="deleteRBField('pwid='+f.endpoint.split('/')[0],i)"
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
                        <div v-if="f.content_type == 'rbfield' && !omittedRBFields.includes(getId('pwid='+f.endpoint.split('/')[0],i))">
                            {{ fieldLoaded(getId('pwid='+f.endpoint.split('/')[0],i),f.text)}}
                            <label>{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                
                                :value="getFieldValue(getId('pwid='+f.endpoint.split('/')[0],i))"
                                @onResult="e=>organizeInput('pwid='+f.endpoint.split('/')[0],f.text,e,i)"
                                @onEmpty="deleteRBField('pwid='+f.endpoint.split('/')[0],i)"
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
                    <strong v-for="cpri,i in currentPageRequiredInvalids" :key="i">
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