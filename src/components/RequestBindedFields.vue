<script setup>
import {axios} from '../functions';
import {onMounted, ref,watch} from 'vue'
let props = defineProps({
    endpoint: {default:'',type:String},
    based: {default:'',type:String},
    readonly: {default:false,type:Boolean},
    type: {default:'',type:String},
    value: {default:'',type:String},
});
let emit = defineEmits(['onResult','onEmpty','onResultInfo']);
let selectedValue = ref('')
let selectedValueInfo = ref(null)
let values = ref([]);
let name = ref(props.endpoint.split('/')[0])

watch(()=>selectedValue.value,()=>{
    emit('onResult',selectedValue.value)
    emit('onResultInfo',values.value.filter(el=>el[props.based] == selectedValue.value)[0])
})

function closeAllOpenSelects(){
    document.querySelectorAll('.pwfvf-rbfields-select').forEach(el=>{
        if(el.dataset.pwfvf == name.value) return;
        el.classList.remove('shown');
    })
    let e = document.querySelector(`.pwfvf-rbfields-select[data-pwfvf="${name.value}"]`);
    if(!e.classList.contains('shown')) e.classList.add('shown');
    else e.classList.remove('shown');
}

onMounted(()=>{
    axios.post(props.endpoint).then(res=>{
        if(res.data == null || !res.data.success){
            emit('onEmpty')
            return;
        }

        values.value = res.data.result

        if(props.value == '') {
            selectedValue.value = values.value[0][props.based];
            selectedValueInfo.value = values.value[0];
        }
        else {
            selectedValue.value = props.value
            emit('onResultInfo',values.value.filter(el=>el[props.based] == selectedValue.value)[0])
        }
    });
    
});

function selectThis(v){
    if(props.readonly) return;
    selectedValue.value = v[props.based];
    selectedValueInfo.value = v
}

</script>

<template>
    <div class="pwfvf-rbfields-select" :class="'pwfvf-rbfields-select-'+name"  v-if="type == 'select'" @click="closeAllOpenSelects" :data-pwfvf="name">
        <span v-html="selectedValue"></span>
        <i class="pwfvf-rbfields-select-caret-down">&#9660;</i>
        <div class="pwfvf-rbfields-select-menu">
            <div :class="{active:selectedValue == v[props.based]}" class="pwfvf-rbfields-select-option" v-for="v,i in values" :key="i" @click="selectThis(v)">
                {{v[props.based]}}
            </div>
        </div>
    </div>
    <div class="pwfvf-rbfields-radio" v-if="type == 'radio'">
        <div :class="{active:selectedValue == v[props.based]}" class="pwfvf-rbfields-radio-option" v-for="v,i in values" :key="i" @click="selectThis(v)">
            <span>{{v[props.based]}} <span class="pwfvf-rbfields-radio-option-price" v-if="v.book_services_price != null">({{'$'+parseFloat(v.book_services_price).toFixed(2)}})</span></span>            
        </div>
    </div>
</template>

<style>
</style>

