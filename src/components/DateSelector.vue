<template>

  <main class="selector">
    <VueScrollPicker v-model="selectedDate" :options="dates" class="days"/>
    <VueScrollPicker v-model="selectedHour" :options="hours" class="hours"/>
    <span class="divisor">:</span>
    <VueScrollPicker v-model="selectedMinute" :options="minutes" class="minutes"/>
  </main>

</template>

<script lang="ts" setup>

import { VueScrollPicker } from 'vue-scroll-picker'
import { computed, ref, toRefs, watch } from 'vue'
import { DateFromIso, FormatShortDate, IsoDate, IsoDateFromDate } from 'src/tools/date-tools'
import { date } from 'quasar'

const props = defineProps<{ modelValue: Date, minuteStep: number }>()
const emit = defineEmits<{(e: 'update:modelValue', value: Date): void }>()

const selectedDate = ref<IsoDate>('')
const selectedHour = ref(8)
const selectedMinute = ref(0)

const arrayRange = (start: number, stop: number, step: number): Array<number> =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  )

const dates: Array<{ name: string, value: IsoDate }> = populateSelector()
const hours: Array<string> = arrayRange(6, 22, 1).map(n => n.toLocaleString('en-UK', {
  minimumIntegerDigits: 2
}))
const minutes: Array<string> = arrayRange(0, 55, toRefs(props).minuteStep.value).map(n => n.toLocaleString('en-UK', {
  minimumIntegerDigits: 2
}))

const model = computed<Date>({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  }
})

function populateSelector (): Array<{ name: string, value: IsoDate }> {
  // start populating dates from today's
  const dates = []
  let possibleDate = new Date()
  for (let i = 0; i < 14; i++) {
    dates.push({
      name: FormatShortDate(possibleDate),
      value: IsoDateFromDate(possibleDate)
    })
    possibleDate = date.addToDate(possibleDate, { day: 1 })
  }
  return dates
}

watch(model, (value) => {
  const isoDate = IsoDateFromDate(value)
  if (isoDate !== selectedDate.value || selectedHour.value !== value.getHours() || selectedMinute.value !== value.getMinutes()) {
    selectedDate.value = isoDate
    selectedHour.value = value.getHours()
    selectedMinute.value = Math.floor(value.getMinutes() / props.minuteStep) * props.minuteStep
  }
}, { immediate: true })

watch([selectedDate, selectedHour, selectedMinute], ([isoDate, hour, minute]) => {
  const newDate = DateFromIso(isoDate)
  newDate.setHours(hour)
  newDate.setMinutes(minute)
  if (newDate !== model.value) model.value = newDate
}, { immediate: true })

</script>

<style lang="scss">
@import "src/css/quasar.variables.scss";

.selector {
  display: flex;
  flex-direction: row;
  color: $primary;
  font-size: medium;
  justify-content: center;
  width: min-content;
}

.days {
  width: 110px;
  text-transform: capitalize; // ensure that strings like 'tomorrow" are capitalised
}

.hours {
  width: 30px;
}

.minutes {
  width: 40px;
}

.divisor {
  color: $on-primary-container;
  background-color: $primary-container;
  height: 40px;
  align-items: center;
  display: flex;
  margin: auto;
  padding-left: 4px;
}

.vue-scroll-picker {
  position: relative;
  height: 120px; // assume three items are displayed, each requiring 40px as per Material guidelines
  overflow: hidden
}

.vue-scroll-picker-rotator {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - .6em)
}

.vue-scroll-picker-rotator-transition {
  transition: top ease .2s
}

.vue-scroll-picker-item {
  text-align: right;
  padding: 8px;
  opacity: 65%;
}

.vue-scroll-picker-item-selected {
  color: $on-primary-container;
  background-color: $primary-container;
  opacity: 100%;
}

.vue-scroll-picker-item-empty, .vue-scroll-picker-item-placeholder {
  color: #aaa
}

.vue-scroll-picker-item-empty.vue-scroll-picker-item-selected, .vue-scroll-picker-item-placeholder.vue-scroll-picker-item-selected {
  color: #777
}

.vue-scroll-picker-layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0
}

.vue-scroll-picker-layer-top, .vue-scroll-picker-layer-selection, .vue-scroll-picker-layer-bottom {
  position: absolute;
  left: 0;
  right: 0
}

.vue-scroll-picker-layer-top {
  box-sizing: border-box;
  top: 0;
  height: 40px;
  cursor: pointer
}

.vue-scroll-picker-layer-selection {
  top: calc(50% - 1em);
  bottom: calc(50% - 1em)
}

.vue-scroll-picker-layer-bottom {
  bottom: 0;
  height: 80px;
  cursor: pointer
}

.days .vue-scroll-picker-item {
  padding-right: 16px;
}

.minutes .vue-scroll-picker-item-selected {
  border-bottom-right-radius: $border-radius;
  border-top-right-radius: $border-radius;
}

.days .vue-scroll-picker-item-selected {
  border-bottom-left-radius: $border-radius;
  border-top-left-radius: $border-radius;
}

.minutes .vue-scroll-picker-item, .hours .vue-scroll-picker-item {
  text-align: left;
}

</style>
