<template>
  <q-page>
    <div class="item-container">

      <div v-for="(item, index) in items" :key="index">
        <div class="icon-text">

          <div>
            <q-icon :name='item.iconName' color='primary' size="40px"/>
          </div>

          <div class="only-text">
            <div class="text-overline text-weight-light">
              {{ item.fieldTag }}
            </div>
            <div class="text-subtitle1 text-bold text-left">
              {{ item.fieldContent }}
            </div>
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  padding-top: 5vh;
  padding-left: 20vw;
  padding-right: 5vw;
}

.icon-text {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

</style>

<script setup>
const items = [
  {
    iconName: 'las la-university',
    fieldTag: 'Faculty',
    fieldContent: 'Informatica'
  },
  {
    iconName: 'las la-user',
    fieldTag: 'User Since',
    fieldContent: '20 ottobre, 2016'
  },
  {
    iconName: 'las la-language',
    fieldTag: 'Speaks',
    fieldContent: 'Italian, English'
  },
  {
    iconName: 'las la-car',
    fieldTag: 'Car Model',
    fieldContent: 'Panda Trattorino micidiale V8 Turbo '
  },
  {
    iconName: 'las la-chart-line',
    fieldTag: 'Often at',
    fieldContent: 'Castro Laurenziano, Tor di quinto'
  },
  {
    iconName: 'las la-dharmachakra',
    fieldTag: 'Rides Given',
    fieldContent: 41
  }
]

</script>
