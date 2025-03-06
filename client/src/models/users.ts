import {ref} from 'vue'

type activityFormat = {
    name: string
    date: string
    duration: number
    distance: string
    location: string
  }
  
  // We must definte a format here, because if ref sees the array is empty (no params) it assumes it should ALWAYS be empty
  const activities = ref<activityFormat[]>([])

  export function refActivities() {
    return activities;
  }

  /*export function refActivities() {
    return activities
  }*/

  export function addActivity() {
    const name = (<HTMLInputElement>document.getElementById("name")).value;
    const date = (<HTMLInputElement>document.getElementById("date")).value;
    const location = (<HTMLInputElement>document.getElementById("location")).value;
    
    const activityObject = {
      name: name,
      date: date,
      duration: 0,
      distance: 'Activity Distance',
      location: location,
    };
  
    // Add the activity to the array of activities to be displayed
    activities.value.push(activityObject);
  }

  export function removeActivity(index: number) {
    activities.value.splice(index, 1);
  }