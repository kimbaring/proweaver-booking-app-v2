<script setup>
import {onMounted, ref,watch,computed} from 'vue'
import {axios} from '../functions'
import TemplatedFields from '../components/TemplatedFields.vue'
import {formData,formCSS} from '../defaults'
import icons,{iconsSolid} from '../assets/icons'
import SchedulerSelect from '../components/SchedulerSelect.vue'
import RequestBindedFields from '../components/RequestBindedFields.vue'

let props = defineProps({
    form:{type:Object},
    page:{default:0,type:Number}
})

let form = ref(null)
let renderedRecaptcha = ref(false);
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
let formSubmitted = ref(false);
let currentPageFieldIds = ref([]);
const currentPage = computed(()=>{
    pageColumnResponsive.value = form.value.pages[currentPageIndex.value].page_columns;
    return form.value.pages[currentPageIndex.value]
});


watch(()=>currentPageIndex.value,()=>{
    currentPageRequired.value = []
    currentPageRequiredLabels.value = [];
    omittedRBFields.value = [];
    setCurrentPageRequired();
    
})

function setCurrentPageRequired(){
    currentPage.value.page_fields.forEach((el,i)=>{
        if(el.content_type=='rbfield' || el.content_type == 'scheduler' || el.required){
            if(el.content_type=='rbfield') currentPageRequired.value.push(`pwp${currentPageIndex.value}_pwo${i}_pwid=${el.endpoint.split('/')[0]}`)
            else if(el.content_type=='scheduler') currentPageRequired.value.push(`pwp${currentPageIndex.value}_pwo${i}_pwid=scheduler`)
            else if(el.content_type=='field') currentPageRequired.value.push(`pwp${currentPageIndex.value}_pwo${i}_${el.name}`)

            if(el.content_type=='rbfield' || el.content_type=='scheduler') currentPageRequiredLabels.value.push(el.text);
            else if(el.content_type=='field') currentPageRequiredLabels.value.push(el.label);

            
        }

        if(el.content_type=='rbfield') currentPageFieldIds.value.push(`pwp${currentPageIndex.value}_pwo${i}_pwid=${el.endpoint.split('/')[0]}`)
        else if(el.content_type=='scheduler') currentPageFieldIds.value.push(`pwp${currentPageIndex.value}_pwo${i}_pwid=scheduler`)
        else if(el.content_type=='field') currentPageFieldIds.value.push(`pwp${currentPageIndex.value}_pwo${i}_${el.name}`)
    });
}


function checkGetter(){
    let getparams = new URLSearchParams(window.location.search);
    if(getparams.get('form_id') == null || props.form != null) {
        if(props.form == null) form.value = formData;
        else form.value = props.form
        let newStyle = document.createElement('style');
        newStyle.id = "pwfv-customcss";
        newStyle.textContent = form.value.design.css ?? formCSS(form.value.design.primaryColor,form.value.design.pagenavDesign)
        if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
        document.body.appendChild(newStyle)
        setCurrentPageRequired()
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
        setCurrentPageRequired()
        window.onresize = ()=>checkResponsive()
        checkResponsive()
    });
}


function filteredByColumn(col){
    if(pageColumnResponsive.value == 1 && col ==1) return currentPage.value.page_fields
    else if (pageColumnResponsive.value == 1 && col ==2) return [];
    else return currentPage.value.page_fields.filter(el=>el.column == col) 
}

function getId(id){
    let index = currentPageFieldIds.value.findIndex(el=>el.includes(id))
    return currentPageFieldIds.value[index]
}

function deleteRBField(id){
    let index = currentPageRequired.value.findIndex(el=>el.includes(id))
    let deletedId = currentPageRequired.value[index];
    requiredFields.value.splice(requiredFields.value.findIndex(el=>el.includes(id)), 1)
    currentPageRequired.value.splice(index,1);
    currentPageRequiredLabels.value.splice(index,1);
    omittedRBFields.value.push(deletedId)
}

function getFieldValue(id){
    let index = userInput.value.findIndex(el=>el.id.includes(id));
    if(index == -1) return null;
    return userInput.value[index].value
}

function organizeInput(id,fieldLabel,fieldValue){
    let fieldId = currentPageFieldIds.value[currentPageFieldIds.value.findIndex(el=>el.includes(id))];
    let index = userInput.value.findIndex(el=>el.id.includes(fieldId));
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


onMounted(()=>{
    checkGetter()
    if(props.page != 0) currentPageIndex.value = props.page;
    let gRecaptchaOnExists =  setInterval(()=>{
        if(document.querySelector('.g-recaptcha') == null) return;

        try{
            clearInterval(gRecaptchaOnExists);

            grecaptcha.render("recaptcha", {
                sitekey: '6LcHeGAkAAAAAJJ--spGuBQszxHROuBbMBsJrRBB',
                callback: function() {
                    console.log('recaptcha callback');
                }
            });
            
            window.parent.document.getElementById('pwform').style.height=document.body.offsetHeight+'px' 
        }catch(err){
            
        }
        
    },100)
    return;
})


function beforePageChange(add,jumpTo=null){
    currentPageRequiredInvalids.value = [];
    if(currentPageRequired.value.length > 0 && (add >= 1 || (jumpTo != null && jumpTo > currentPageIndex.value)) ){
        currentPageRequired.value.forEach((el,i)=>{
            let index = userInput.value.findIndex(el2=>{
                if(typeof el2.value == 'object' && el2.id == el){
                    el2.value = JSON.parse(JSON.stringify(el2.value));  
                    if(el2.value == null || el2.value.length == 0) return false;
                    else return true;
                } 
                return el2.id == el && !['',null,[]].includes(el2.value)
            });
            if(index == -1) {
                currentPageRequiredInvalids.value.push({
                    id: el,
                    label: currentPageRequiredLabels.value[i]
                })
            }
                
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
    if(currentPageRequiredInvalids.value.length > 0) return;
    let locationIndex = userInput.value.findIndex(el=>el.id.includes('pwid=location'))
    let workerIndex = userInput.value.findIndex(el=>el.id.includes('pwid=worker'))
    let servicesIndex = userInput.value.findIndex(el=>el.id.includes('pwid=services'))
    let scheduleIndex = userInput.value.findIndex(el=>el.id.includes('pwid=scheduler'))
    let location = userInput.value[locationIndex] ?? '';
    let worker = userInput.value[workerIndex] ?? '';
    let services = userInput.value[servicesIndex] ?? '';
    let schedule = userInput.value[scheduleIndex] ?? '';

    if(grecaptcha.getResponse().length == 0){
        alert('Please complete the reCAPTCHA!')
        return;
    }

    axios.post('appointments/create',null,{
        book_appointment_locationname:location.value ?? '',
        book_appointment_servicesname:services.value ?? '',
        book_appointment_worker:worker.value ?? '',
        book_appointment_scheduleid:schedule.value ?? '',
        book_appointment_custominputs: JSON.stringify(userInput.value)
    }).then(res=>{
        if(res.data == null || !res.data.success){
            alert('Something went wrong! You may contact the website admin and inform them about this problem. Your feedback will be appreciated!')
            return;
        }
        formSubmitted.value = true;

    });
}



async function checkResponsive(){
    pageColumnResponsive.value = currentPage.value.page_columns

    const responsiveClasser = ()=>{
        document.getElementById('pwfv-parent').dataset.responsive=""
        if(document.getElementById('pwfv-parent').offsetWidth <= 400)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r400 ";

        if(document.getElementById('pwfv-parent').offsetWidth <= 600)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r600 ";
        if(document.getElementById('pwfv-parent').offsetWidth <= 800){
            document.getElementById('pwfv-parent').dataset.responsive= document.getElementById('pwfv-parent').dataset.responsive + "r800 ";
            pageColumnResponsive.value = 1;
        }
        if(document.getElementById('pwfv-parent').offsetWidth <= 1000)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r1000 ";
        if(document.getElementById('pwfv-parent').offsetWidth <= 1200)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r1200 ";
        if(document.getElementById('pwfv-parent').offsetWidth <= 1400)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r1400 ";

        if(window.parent.document.getElementById('pwform') != null){
            new ResizeObserver(()=>{
                console.log('test');
                window.parent.document.getElementById('pwform').style.width='100%' 
                window.parent.document.getElementById('pwform').style.overflow='hidden' 
                window.parent.document.getElementById('pwform').style.border='none' 
                window.parent.document.getElementById('pwform').style.height=(document.body.offsetHeight < 500) ? 500 : document.body.offsetHeight+'px'
            }).observe(document.body)
        }
        
    }
    if(document.getElementById('pwfv-parent') == null){
        let parentChecker =  setInterval(()=>{
            if(document.getElementById('pwfv-parent') == null) return;
            clearInterval(parentChecker);
            
            responsiveClasser();
        },100)
        return;
    }
    responsiveClasser();
}


</script>
<template>
   <div id="pwfv-parent" ref="formElement" v-if="form != null" data-responsive="">
        <div class="pwfv-header">
            {{ form.form_title }} 
                
        </div>
        <div class="pwfv-body" v-if="!formSubmitted">
            <div class="pwfv-navigation" v-if="form.pages.length > 1">
                <div class="pwfv-navigation-item" :class="{active:currentPageIndex == i,done:progressIndex > i}" v-for="p,i in form.pages" :key="i" @click="beforePageChange(null,i)">
                    <span>{{progressIndex > i ? '&check;' : i+1}}</span>
                    {{ p.page_title }}
                </div>
            </div>
            <div class="pwfv-maingrid " :class="{'two-cols':currentPage.page_columns == 2}">
                <p class="pwfv-required-reminder" v-if="currentPageRequired.length > 0">Required Fields are marked with (*)</p>
                <div class="pwfv-maingrid-1">
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(1)" :key="i">
                        <!-- field renderer start-->
                        <div v-if="f.content_type == 'rbfield' && !omittedRBFields.includes(getId('pwid='+f.endpoint.split('/')[0],i))">
                            
                            <label>{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                :value="getFieldValue('pwid='+f.endpoint.split('/')[0])"
                                @onResult="e=>organizeInput('pwid='+f.endpoint.split('/')[0],f.text,e)"
                                @onEmpty="deleteRBField('pwid='+f.endpoint.split('/')[0])"
                            />
                        </div>
                        <div v-if="f.content_type == 'scheduler'">
                            
                            <label>{{ f.text }} <span>*</span></label>
                            <SchedulerSelect
                                :schedule="getFieldValue('pwid=scheduler')"
                                :service="getFieldValue('pwid=services')"
                                @onResult="e=>organizeInput('pwid=scheduler',f.text,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field' && f.type != 'checkbox'">
                            <label>{{ f.label }} <span v-if="f.required">*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.name) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.name)"
                            @onResult="e=>organizeInput(f.name,f.label,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'checkbox'">
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.name) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.name)"
                            @onResult="e=>organizeInput(f.name,f.label,e)"
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
                            
                            <label>{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                :value="getFieldValue('pwid='+f.endpoint.split('/')[0])"
                                @onResult="e=>organizeInput('pwid='+f.endpoint.split('/')[0],f.text,e)"
                                @onEmpty="deleteRBField('pwid='+f.endpoint.split('/')[0])"
                            />
                        </div>
                        <div v-if="f.content_type == 'scheduler'">
                            
                            <label>{{ f.text }} <span>*</span></label>
                            <SchedulerSelect
                                :schedule="getFieldValue('pwid=scheduler')"
                                @onResult="e=>organizeInput('pwid=scheduler',f.text,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field' && f.type != 'checkbox'">
                            <label>{{ f.label }} <span v-if="f.required">*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.name) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.name)"
                            @onResult="e=>organizeInput(f.name,f.label,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'checkbox'">
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.name) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.name)"
                            @onResult="e=>organizeInput(f.name,f.label,e)"
                            />
                            <label :for="f.name" class="pwfvf-checkbox-label">{{ f.label }} <span v-if="f.required">*</span></label>
                        </div>
                        <!-- field renderer end-->
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
                    <div class="pwfv-recaptcha-parent">                        
                        <div id="recaptcha" v-show="currentPageIndex == form.pages.length -1" class="g-recaptcha" data-sitekey="6LcHeGAkAAAAAJJ--spGuBQszxHROuBbMBsJrRBB"></div>
                    </div>
                    <button @click="beforePageChange(-1)" v-if="currentPageIndex != 0"><i v-html="icons.arrowLeft"></i> Prev</button>
                    <button @click="beforePageChange(1)" v-if="currentPageIndex != form.pages.length -1">Next <i v-html="icons.arrowRight"></i></button>
                    <button @click="submit()" v-if="currentPageIndex == form.pages.length -1 " class="pwfv-submit">Submit</button>
                </div>
            </div>
        </div>
        <div class="pwfv-success" v-if="formSubmitted">
            <div class="pwfv-success-box">
                <div class="pwfv-success-checkmark"><i v-html="iconsSolid.check"></i></div>
                Your entry has been successfully submitted. We will process it and update you as soon as possible.
            </div>
            
        </div>
   </div>
</template>
<style scoped>

</style>