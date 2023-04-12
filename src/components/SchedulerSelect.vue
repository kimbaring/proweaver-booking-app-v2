<script>
import {axios, dateFormat} from '../functions'

export default{
    emits:['onResult','onFetch'],
    props:{
        schedule: {
            type: String
        },
        service:{
            default:'',
            type:String
        }
    },
    data(){
        return{
            title:'',
            cc:{y:0,m:0,d:0},
            qd:{y:0,m:0,d:0},
            calendarBoxes:[],
            availDates:[],
            availableSchedules:[],
            fetching:false,
            chosenSchedule:null,
        }
    },
    watch:{
        fetching(){
            this.$emit('onFetch',this.fetching)
        },
        async schedule(){
            if(['',null].includes(this.schedule)) return;
            this.fetching = true;
            this.chosenSchedule = this.schedule
            let requestString = 'schedules/fetchAvailable?book_schedule_id='+this.schedule;
            if(this.service != '' && this.service != null) requestString+='&book_schedule_service='+this.service    
            let res = await axios.post(requestString,'default')
            if(res.data == null || !res.data.success) return;
            let date = new Date(res.data.result[0].book_schedule_date);
            this.cc.y = date.getFullYear();
            this.cc.m = date.getMonth();
            this.cc.d = date.getDate();
            this.qd.y = date.getFullYear();
            this.qd.m = date.getMonth();
            this.qd.d = date.getDate();
            this.buildCalendar();
            this.fetching = false;
        },
        service(){
            this.fetchScheds();
        }
    },
    async mounted(){
        let date = new Date();
        this.cc.y = date.getFullYear();
        this.cc.m = date.getMonth();
        this.cc.d = date.getDate();
        this.qd.y = date.getFullYear();
        this.qd.m = date.getMonth();
        this.qd.d = date.getDate();

        this.buildCalendar();
        
        if(['',null].includes(this.schedule)) return;
        this.fetching = true;
        let requestString = 'schedules/fetchAvailable?book_schedule_id='+this.schedule;
        if(this.service != '' && this.service != null) requestString+='&book_schedule_service='+this.service  
        let res = await axios.post(requestString,'default')
        if(res.data == null || !res.data.success) return;
        date = new Date(res.data.result[0].book_schedule_date);
        this.cc.y = date.getFullYear();
        this.cc.m = date.getMonth();
        this.cc.d = date.getDate();
        this.qd.y = date.getFullYear();
        this.qd.m = date.getMonth();
        this.qd.d = date.getDate();
        this.fetching = false;
        this.fetchScheds().then(()=>{
            this.buildCalendar();
            this.chosenSchedule = this.schedule
        })
        
    },
    methods:{
        dateFormat,
        selectSchedule(sched){
            if(
                new Date(sched.book_schedule_date+' '+sched.book_schedule_timestart).getTime() <=
                new Date().getTime()
            ){
                alert('Cannot select a finished schedule!')
                return
            }

            if(sched.is_full){
                alert('Your chosen schedule is no longer available as it reached maximum number of bookings.')
                return;
            }

            this.chosenSchedule = sched.book_schedule_id
            this.$emit('onResult',this.chosenSchedule)
        },
        async fetchScheds(){
            if(this.fetching) return;
            this.fetching = true;
            let date = new Date(this.cc.y,this.cc.m,this.cc.d);
            this.availDates = [];
            this.availableSchedules = [];
            let includeService = (this.service != '' && this.service != null) ? '&service='+this.service : ''
            let res = await axios.post(`schedules/availableSchedulesWithinMonth?month=${this.cc.m+1}&year=${this.cc.y}${includeService}`,'default');
            if(res.data != null && res.data.success){
                res.data.result.forEach(el=>{
                    this.availDates.push(el.book_schedule_date);
                });    
            }
            
            includeService = (this.service != '' && this.service != null) ? '&book_schedule_service='+this.service : ''
            res = await axios.post('schedules/fetchAvailable?book_schedule_date='+dateFormat('%y-%M-%D',date.getTime())+includeService,'default')
            if(res.data != null && res.data.success){
                res.data.result.forEach(el=>{
                    if(el.book_schedule_maxappointment < el.count_appointments) el.schedule_full = true;
                    else el.schedule_full = false;
                    this.availableSchedules.push(el);
                });
                if(this.value != null) this.selectedSchedule = this.value;
            }
            this.fetching = false;

            return;
        },
        buildCalendar(){
            let startMonth = new Date(this.cc.y,this.cc.m,1);
            let endMonth = new Date(this.cc.y,this.cc.m+1,0);
            let offsetStart = new Date(this.cc.y,this.cc.m,1).getDay();
            let offsetEnd = new Date(this.cc.y,this.cc.m+1,0).getDay();
            startMonth.setDate(startMonth.getDate() - offsetStart);
            endMonth.setDate(endMonth.getDate() + (6 - offsetEnd));
            this.calendarBoxes = [];

            while(startMonth.getTime() <= endMonth.getTime()){
                let dateString = dateFormat('%y-%M-%D',startMonth.getTime());
                let newDateBox = {
                    date: dateString,
                    dateNum: startMonth.getDate(),
                    isCurrentMonth: startMonth.getMonth() == this.cc.m,
                    scheds:this.fetchScheds(dateString),
                    onclick:async (dateString)=>{
                        if(this.fetching) return;
                        let date = new Date(dateString);
                        this.qd.y = date.getFullYear();
                        this.qd.m = date.getMonth();
                        this.qd.d = date.getDate();
                        if(date.getMonth() != this.cc.m){
                            date = new Date(this.qd.y,this.qd.m,this.qd.d)
                            this.cc.y = date.getFullYear();
                            this.cc.m = date.getMonth();
                            this.cc.d = date.getDate();
                            this.fetchScheds().then(()=>{
                                this.buildCalendar()
                                this.fetching = false;
                            });
                            return;
                        }
                        this.fetching = true;
                        this.availableSchedules = [];
                        let includeService = (this.service != '' && this.service != null) ? '&book_schedule_service='+this.service : ''
                        let res = await axios.post('schedules/fetchAvailable?book_schedule_date='+dateFormat('%y-%M-%D',date.getTime())+includeService,'default')
                        if(res.data != null && res.data.success){
                            res.data.result.forEach(el=>{
                                if(el.book_schedule_maxappointment < el.count_appointments) el.schedule_full = true;
                                else el.schedule_full = false;
                                this.availableSchedules.push(el);
                            });
                            if(this.value != null) this.selectedSchedule = this.value;
                        }
                        this.fetching = false;
                    }
                }
                this.calendarBoxes.push(newDateBox);
                startMonth.setDate(startMonth.getDate() + 1);
            }

            this.title = dateFormat('%lm %y',new Date(this.cc.y,this.cc.m,this.cc.d).getTime());
        },
        nextMonths(num){
            if(this.fetching) return;
            let date = new Date(this.cc.y,this.cc.m,this.cc.d);
            date.setMonth(date.getMonth() + num);
            if(num > 0 && new Date(this.cc.y,this.cc.m+2,0).getDate() < this.cc.d) date.setMonth(date.getMonth() - 1);
            if(num < 0 && new Date(this.cc.y,this.cc.m-1,0).getDate() < this.cc.d) date.setMonth(date.getMonth() + 1);
            this.qd.y = this.cc.y = date.getFullYear();
            this.qd.m = this.cc.m = date.getMonth();
            this.qd.d = this.cc.d = date.getDate();
            
            this.buildCalendar();
        },
    }
}

</script>

<template>
    <div class="pwfvf-scheduler"> <!--scheduler parent -->
        <div class="pwfvf-scheduler-header">
            <button @click="nextMonths(-1)">&#10094;</button>
            <h2>{{ title }}
            </h2>
            <button @click="nextMonths(1)">&#10095;</button>
        </div>
        <div class="pwfvf-scheduler-dateboxes">
            <div @click="cb.onclick(cb.date)" class="pwfvf-scheduler-datebox" v-for="cb,i in calendarBoxes" :class="{notCurrentMonth: !cb.isCurrentMonth, active:new Date(cb.date + ' 00:00:00').getTime() == new Date(qd.y,qd.m,qd.d).getTime(), hasSchedule:availDates.includes(cb.date)}">
                <span>{{cb.dateNum}}</span>
            </div>
        </div>
        <div class="pwfvf-scheduler-availscheds">
            <div class="spinner" v-if="fetching"></div>
            <div class="pwfvf-scheduler-availscheds-empty" v-if="!fetching && availableSchedules.length == 0">No schedules for this date...</div>
            <div class="pwfvf-scheduler-availscheds-item" v-for="asc in availableSchedules" @click="selectSchedule(asc)" :class="{active:chosenSchedule == asc.book_schedule_id}">
                <h2>{{ asc.book_schedule_service }}
                    <span v-if="asc.is_full"> FULL</span>
                    <span v-if="new Date(asc.book_schedule_date+' '+asc.book_schedule_timestart).getTime() <=
                new Date().getTime()"> DONE</span>
                </h2>
                <small>{{ dateFormat('%h:%I%a',asc.book_schedule_date +' '+asc.book_schedule_timestart)}} - 
                {{ dateFormat('%h:%I%a',asc.book_schedule_date +' '+asc.book_schedule_timeend)}}</small>
            </div>
        </div>
    </div><!--/scheduler parent -->
</template>

<style>

.spinner {
  display: block;
  margin: 0 auto;
  width: 20px;
  height: 20px;
  border: 3px solid #aaa;
  border-top-color: #222;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pwfvf-scheduler-availscheds-item h2 span{
    font-size: 11px;
    padding: 2px 5px;
    background: rgb(165, 48, 48);
    color: #fff;
    border-radius: 14px;
    margin: 2px;
}


</style>