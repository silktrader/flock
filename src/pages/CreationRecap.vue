<template>
    <q-page class="column">
      <header class="modal-header">
        <q-btn aria-label="Back" flat icon="arrow_back" size="lg" @click="router.go(-1)"/>
        <div class="modal-header-spacer"/>
        <section class="modal-header-title">
          <span style="padding-right: 1em; font-weight: bolder;">Summary</span>
          <!--        <span class="modal-header-subtitle">Results</span>-->
        </section>
        <section>
          <q-btn aria-label="Close" flat icon="close" size="lg" @click="abort()"/>
        </section>
      </header>
      <q-separator/>
      <div class="centering">
        <section class="row justify-center">
          <div style="padding: 2em 1em 0 1em; width: 300px; height: 320px;font-size: large;">

              <q-card-section>
              <div class="text-h6">Confirm ?</div>
              <q-separator spaced/>
              </q-card-section>

              <q-card-section class="q-pt-none">
              <div>
                  <div style="text-align: center; padding-top: 0.5em;">
                  {{ ExtractDate(ds.temporaryDrive.Departure) }}
                  <!--{{ recurrentCheck ? everyWeekdayModel : date.slice(0, -5) }} -->
                  </div>
                  <div style="padding-bottom: 1.5em; text-align: center;">
                  {{ ExtractTime(ds.temporaryDrive.Departure) }}
                  </div>
                  <div style="min-width: 200px;">
                  <div class="row">
                      <div style="font-weight: bold; padding-right: 2px; padding-bottom: 0.2em;">From:</div>
                      <div style="font-style: italic;"> {{ds.temporaryDrive.Origin.Address}}</div>
                  </div>

                  <div class="row" style="padding-bottom: 2em">
                      <div style="font-weight: bold; padding-right: 2px;">To:</div>
                      <div style="font-style: italic;"> {{ds.temporaryDrive.Destination.Address}}</div>
                  </div>

                  <div class="row justify-around" style="padding-top: 0.5em; font-size: medium;">
                      <div>
                      <q-icon name="emoji_people" size="1.5em"/>
                      : {{ ds.temporaryDrive.FreeSeats }}
                      </div>
                      <div style="padding: 0 1em 0 1.7em;">
                      <q-icon name="savings" size="1.5em"/>
                      : {{ ds.temporaryDrive.Earning + '$' }}
                      </div>
                      <div>
                      <q-icon name="mode_of_travel" size="1.5em"/>
                      : 40 min
                      </div>
                  </div>

                  </div>
              </div>
              </q-card-section>
              <div class="row justify-center" style="padding-top: 1.5em;">
              <q-btn rounded class="createButton pulsingButton" label="Create"
                      style="font-size:smaller;" @click="confirmation()"/>
              </div>
          </div>
          </section>
      </div>
    </q-page>
</template>

<script lang="ts" setup>
import { ExtractDate, ExtractTime } from 'src/tools/date-tools'
import { useDriveStore } from 'src/stores/driveStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const ds = useDriveStore()
const router = useRouter()
const arrivalDate = new Date(ds.temporaryDrive.Departure)

function confirmation (): void {
  ds.updateField('Arrival', arrivalDate.setMinutes(arrivalDate.getMinutes() + 40))
  ds.updateField('Id', ds.temporaryDrive.Id + 1)
  ds.addDrive(ds.temporaryDrive)
  router.push('/create-ride/confirm')
}

function abort (): void {
  ds.clearTemporaryDrive()
  router.push('/')
}

</script>
<style lang="scss" scoped>
@import "src/css/quasar.variables.scss";

.createButton {
  background-color: $primary-container;
  color: white;
  width: 8em;
  height: 3em;
}
.centering{
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  }

</style>
