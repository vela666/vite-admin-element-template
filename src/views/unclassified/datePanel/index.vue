<template>
  <div class="flex-column">
    <div>
      <DateRangeSelect :show-border="true" :needDynamic="true" v-model="value">
        <EventComparison v-model="value.versus" />
      </DateRangeSelect>

      {{ value }}
      <div>
        <TableComparativeSelect
          v-model="selectedStageTableIndex"
          v-model:versus="value.versus" />
      </div>
    </div>
    <div class="flex-column mt20">
      <DateRangeSelect
        isChecked
        closeIcon
        :needDynamic="false"
        v-model="value1" />
      {{ value1 }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DateRangeSelect from './components/DateRangeSelect/index.vue'
import EventComparison from './components/DateRangeSelect/EventComparison/index.vue'
import TableComparativeSelect from './components/DateRangeSelect/EventComparison/TableComparativeSelect.vue'
const value = ref({
  timeZone: '8',
  timeParticle: 'hour',
  recentDay: '1-',
  startTime: '2023-10-03 00:00:00',
  endTime: '2023-10-21 23:59:59',
  graphType: 1,
  versus: [
    {
      date: ['2023-10-01', '2023-10-22'],
      diff: '0-21',
      mainName: '本月',
      startTime: '2023-10-01 00:00:00',
      endTime: '2023-10-22 23:59:59',
      tableCurrentSelectionStage: true,
      recentDay: '0-21',
      shortcutType: 'currentMonth',
    },
    {
      date: ['2023-09-01', '2023-09-30'],
      diff: '22-51',
      mainName: '上月',
      startTime: '2023-09-01 00:00:00',
      endTime: '2023-09-30 23:59:59',
      tableCurrentSelectionStage: false,
      recentDay: '22-51',
      shortcutType: 'lastMonth',
    },
  ],
  date: ['2023-10-03', '2023-10-21'],
  diff: '1-',
  mainName: '2023-10-03 ~ 昨日',
  shortcutType: 'certainDayToYesterday',
})
const selectedStageTableIndex = ref(1)
const value1 = ref({
  date: [],
  diff: '',
})

defineOptions({
  name: 'Test',
})
</script>

<style lang="scss"></style>
