import { defineStore } from 'pinia'
import { Drive } from 'src/models/drive'

// Define your store
export const useDriveStore = defineStore('driveStore', {
  state: () => ({
    drives: [] as Drive[], // Initialize an empty array to store drives
    temporaryDrive: {} as Drive // Initialize an empty Drive object for temporary data
  }),

  getters: {
    // Optionally, you can define getters to access the state
    getDrives: (state) => state.drives,
    getTemporaryDrive: (state) => state.temporaryDrive
  },

  actions: {
    // Define actions to modify the state

    // Add a completed drive to the main drives array
    addDrive (newDrive: Drive) {
      this.drives.push(newDrive)
    },

    // Remove a drive from the main drives array (if needed)
    removeDrive (driveId: string) {
      this.drives = this.drives.filter((drive) => drive.Id !== driveId)
    },

    // Set the temporary drive object with collected data
    setTemporaryDrive (driveData: Drive) {
      this.temporaryDrive = { ...driveData } // Copy driveData into temporaryDrive
    },

    updateField (fieldName: string, fieldValue: any) {
      if (['Id', 'Origin', 'Destination', 'Arrival', 'Departure', 'CarS', 'Earning', 'Passengers', 'Recurring', 'before', 'after', 'FreeSeats'].indexOf(fieldName) !== -1) {
        this.temporaryDrive[fieldName] = fieldValue
      } else {
        console.log(`Field '${fieldName}' does not exist in temporaryDrive.`)
      }
    },

    // Clear the temporary drive object (useful after finalizing a drive)
    clearTemporaryDrive () {
      this.temporaryDrive = {} as Drive // Clear the temporaryDrive
    }
  }
})
