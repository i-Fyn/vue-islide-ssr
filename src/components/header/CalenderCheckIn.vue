<template>
    <div class="calendar-checkin box h-auto text-sm cursor-default shadow-lg select-none rounded-lg overflow-hidden bg-base-100" v-cloak>
        <div class="calendar-header flex h-10 px-6 text-sm  text-base-content/60 leading-10 justify-between items-center border-b border-gray-200">
            <div class="calendar-title">{{ month }} 月累计签到</div>
            <span class="days">{{ checkedDays }} / {{ totalDays }}</span>
        </div>
        <div class="calendar-body px-6 pt-3">
            <div class="weekdays flex h-[38px] leading-[38px] justify-around">
                <span class="weekday" v-for="day in weekDays" :key="day">{{ day }}</span>
            </div>
            <div class="days">
                <span class="day-item" v-for="day in daysInMonth" :key="day"
                    :class="[{ checked: signDaysList.includes(day) }, { 'hide': day == null }, { 'cur-day': isToday(day) }]">
                    {{ day }}
                </span>
            </div>
        </div>
        <div class="calendar-footer flex items-center pt-3 flex-col">
            <div class="checkin-info mb-2  text-base-content/60">
                已连续签到{{ consecutiveDaysCopy }}天
            </div>
            <button class="checkin-btn btn btn-soft btn-primary w-full text-sm py-2.5 px-2.5 rounded-none   disabled:opacity-50" :disabled="isCheckInCopy" @click="checkin">{{ isCheckInCopy ? '今日已' : '' }}签到</button>
        </div>
    </div>
</template>

<script setup>

import { ref, nextTick, watch, onMounted } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message'
import { useStore } from '@/store'

const store = useStore()
const props = defineProps({
    isCheckIn: {
        type: Boolean,
        default: false
    },
    consecutiveDays: {
        type: Number,
        default: 0
    },
})
const emit = defineEmits(['checkin-success'])


const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const weekDays = ref(['日', '一', '二', '三', '四', '五', '六'])
const daysInMonth = ref([])
const checkedDays = ref(0) //本月总签到次数
const totalDays = ref(31)
const signDaysList = ref([])
const curDay = ref(0) //第几号
const isPrevMonthBtnHidden = ref(false)
const isNextMonthBtnHidden = ref(false)
const consecutiveDaysCopy = ref(props.consecutiveDays)
const isCheckInCopy = ref(props.isCheckIn)

onMounted(async ()=>{
    await getCheckinData();
    updateCalendar();
})

const getCheckinData = async () => {
    try {
        let res = await axios.post('/getUserSignInfo');
        const data = res.data.data;
        checkedDays.value = data.signDays;
        totalDays.value = data.allDays;
        signDaysList.value = data.signDaysList;
        consecutiveDaysCopy.value = data.consecutiveDays;


        nextTick(() => {
          store.isCheckIn =isCheckInCopy.value = data.isCheckIn
        })

        curDay.value = data.curDay;
    } catch (err) {
       // message({ message: err.response.data.message, type: 'warning' });
    }
}



const updateCalendar = () => {
    const date = new Date(year.value, month.value - 1);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const _daysInMonth = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
        _daysInMonth.push(i);
    }
    const firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek !== 0) {
        const emptyDays = new Array(firstDayOfWeek).fill(null);
        daysInMonth.value = [...emptyDays, ..._daysInMonth];
    } else {
        daysInMonth.value = _daysInMonth;
    }
    totalDays.value = _daysInMonth.length;
    isPrevMonthBtnHidden.value = firstDay.getDay() === 0;
    isNextMonthBtnHidden.value = lastDay.getDay() === 6;
}

const checkin = () => {
    nextTick(() => {
        signDaysList.value.push(parseInt(curDay.value))
    })
    checkedDays.value = checkedDays.value + 1;
    emit('checkin-success');

}


const prevMonth = () => {
    if (month.value === 1) {
        month.value = 12;
        year.value--;
    } else {
        month.value--;
    }
    updateCalendar();
}

const nextMonth = () => {
    if (month.value === 12) {
        month.value = 1;
        year.value++;
    } else {
        month.value++;
    }
    updateCalendar();
}



const isToday = (day) => {
    const today = new Date();
    return year.value === today.getFullYear() && month.value === today.getMonth() + 1 && day === today.getDate();
}

watch(() => props.consecutiveDays, (newVal) => {
    consecutiveDaysCopy.value = newVal;
})

watch(() => props.isCheckIn, (newVal) => {
    isCheckInCopy.value = newVal;
})

</script>

<style scoped>
.calendar-checkin .calendar-body .days .day-item {
	display: inline-block;
	width: 14.2857%;
	height: 38px;
	position: relative;
	text-align: center;
	color: var(--color-text-secondary);
	line-height: 41px;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAYAAACJfM0wAAAAAXNSR0IArs4c6QAAAmFJREFUOBGtVM1rE1EQ391sPjeQfthNrF20XkoLxSBe9OAhHr14kOgl53oUepTioSC01woeLFUSPIh/hRDJLT2kGJLABkJKko1CNtlk87FJ+puFlLLtKmU78Hhv3m/m92ZmZ4dlbKRcLs8BeuH3+39EIpGujZntNWeHDAaD99Pp9EuxWPx6lU2lUnmUz+d/ZrPZjatwni7r9brYbrePcNwcj8dqp9PZG41GDz0eD9Pv9yVZlh/wPO8xDENxu92KJEk6bHaQzdNarXYAv2fEc1FM4lar9RkkzwkAAVOtVl/7fD6BdERexUrhuEk6HmTS6fQHZHOXdGBGoVDYZll2Bb4nwWDwuyiKmlkKGD0mo5mEQqGNRqOxWyqVTpHBN0S5NsNo7/V664hehx+DTH9PJpNtkL4FdNhsNmXccywZgkB3uVw+Os+k2+2eeL3eX4jkJbDF2T3tmqa1UOMnqqq+iUajx4FA4AhkJhfhuVwuwRI7OsCAfg4Q+D9BJgZ8/yLSsNU2k8ls8Uj5FoBrkRIRsqDvc4kUjzHIVuaGw6FIhjcl9HFRPoXDC5dedfIIAqXOUjj06aoTIqsvIp4KgtCkUty3gk509PUgHo+PqY8lJ0RWX3SLRnccmnvZCjrRUQrVJEahl5wQWX3xR/4xidEaC1bQiY5S1E1ilGLihMjqi1KcmsSKonykpr4p0XW9TFx8LBbbT6VSx5itr1BvCZMsjH0RewhLwOJoLmNnMJTMsWoXBIYSTbs04f+cEfgr2WQyuYC6hbFE6CIeuYMg7uGhFazbWEsIZB4fjcPI/JRIJN4R8RmXeSBdcAX/7AAAAABJRU5ErkJggg==);
	background-size: 22px 20px;
	background-position: center center;
	background-repeat: no-repeat;
}

.calendar-checkin .calendar-body .days .day-item.hide {
	visibility: hidden;
	height: 0;
}

.calendar-checkin .calendar-body .days .day-item.cur-day {
	color: var(--bg-main-color);
}

.calendar-checkin .calendar-body .days .day-item.checked {
	color: var(--bg-main-color);
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAYAAACJfM0wAAAAAXNSR0IArs4c6QAAAoZJREFUOBGtlE9I1EEUx9+bmZ+7apR/ck1TTI0kwYooIg9BdOgQRIewLp2rW+AxKiMo6loQUVggHWyhRTrVLSg6hRRadFHLf+umrbvu7s/9zfzmNbNiyK4bxK85zG/mfd/7zJ/fvIdQph2IJWuysHqmsgqjn0/uyJZxK2tm5ZS0l76hiZ6mJmeebebTNTJ3qGP4+9vdL8a7N9OFNe57HY9k03KQgHpA+ynI5O6CUgfBcQB92brn1cJ+IF3BOSVqapsSH3rR9XL5aywUOiYXMvcN4kQxvABeSeUfM+GcQqtyASo3d56HI9V2qvOrMyqXHUIn3OMrgER8HtoffbyNoNusTlKqzuGpfgLWwgQfC9U5w+PHI5nCVSDRUeu03tiWrd06uXRLzk7OGsBzFKGudc1+tZffS75ygcwZc5kvpu9HR1whxCdufGViYIBYYZOd0WkXOA9vDKa8O4bMeY+CnSVk9Rs17WaX9fJcr59KXQq19YxCVXjQLFJgWT/549sFHCBiQ7F5c0j4I2yElB0TKdL+EnLRWOwjv366yF6+Wdj+z1BLQhSbQe31KDc9waSESPGKQeakJJifmGC+hJKjBAJLDwToBDPPqT0IqCTWV3S4G34yk10dJWIAg3mG+Whfn8+AVGsATkmoAWes0YChuUQNYlAqtQbmvCEIpzgWtb+4BkZWVywGmWtPxtfA2tdBQMWxJiFnC2C9vPjAPur/1jw5aVli6vKRe803R0Z5KHzO1N9WYKwRRUU9Cr4NuFONwmEoTHV1KsCMwaRx2T3obBr0avKddfhr4SFTsVruxOq4pxq1wgihjgA6OzFcuQsc3sK402QWazA1vJa0YpT89XD6+umrFvwbXOsNicazLGIAAAAASUVORK5CYII=);
}

</style>