<template>
  <q-page class="justify-start" style="background:#E9F1F7; ">
    <div class="row" style="transform: scale(0.8); padding-top:0.8em">
      <div class="col">
        <q-input v-model="startingAddress" :style="styleStart" bg-color="white" class="custom" dense outlined
                 rounded style="padding-bottom: 0.5em;">

          <template v-slot:prepend>
            <q-icon name="pin_drop"/>
          </template>

        </q-input>
        <q-input v-model="destinationAddress" :style="styleDest" bg-color="white" class="custom" dense outlined rounded>

          <template v-slot:prepend>
            <q-icon name="near_me"/>
          </template>

        </q-input>
      </div>
      <q-btn class="swap-btn" icon="swap_vert" padding="xs" round size="lg" style="background-color:#0068FF; color:white; margin: auto;"
             @click="swapSearch"/>
    </div>
  </q-page>
</template>

<style>
.custom::placeholder {
  font-weight: bolder;
}

.swap-btn {
  transition: transform 0.33s;
}

.rotate {
  transform: rotate(180deg);
}
</style>

<script>
export default {
  data () {
    return {
      destinationAddress: '',
      startingAddress: 'Your current location'
    }
  },

  created () {
    this.destinationAddress = this.$route.query.searchText
  },

  computed: {
    styleStart () {
      if (this.startingAddress === 'Your current location') {
        return 'font-style: italic;'
      } else {
        return ''
      }
    },
    styleDest () {
      if (this.destinationAddress === 'Your current location') {
        return 'font-style: italic;'
      } else {
        return ''
      }
    }
  },

  methods: {
    swapSearch () {
      const button = document.querySelector('.swap-btn')
      button.classList.toggle('rotate')
      const bridge = this.startingAddress
      this.startingAddress = this.destinationAddress
      this.destinationAddress = bridge
    }
  }
}
</script>

<!-- <script>
export default {
    data() {
        return {
            destinationAddress: '',
            startingAddress: 'Your current location',
            styleStart:'font-style: italic;',
            styleDest: ''
        };
    },

    created() {
        this.destinationAddress = this.$route.query.searchText;
    },

    methods: {
        swapSearch() {
            const button = document.querySelector('.swap-btn')
            button.classList.toggle('rotate')
            var bridge = this.startingAddress
            this.startingAddress = this.destinationAddress
            this.destinationAddress = bridge
            if (this.startingAddress === 'Your current location') {
            this.styleStart = 'font-style: italic;'
            } else {
                this.styleStart = ''
            }
            if (this.destinationAddress === 'Your current location') {
            this.styleDest= 'font-style: italic;'
            } else {
                this.styleDest = ''
            }
        }
    }
}
</script> -->
