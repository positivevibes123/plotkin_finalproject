import {ref} from 'vue'

// Handling user activities (maybe move to a separate file...)

type activityFormat = {
    description: string
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

  export function addActivity(desc : string, date : string, loc : string) {
    const activityObject = {
      description: desc,
      date: date,
      duration: 0,
      distance: 'Activity Distance',
      location: loc,
    };
  
    // Add the activity to the array of activities to be displayed
    activities.value.push(activityObject);
  }

  export function removeActivity(index: number) {
    activities.value.splice(index, 1);
  }

  // Handling users

  type userFormat = {
    userId: number
    username: string
    firstName: string
    lastName: string
    email: string
    isAdmin: boolean
  }

  const users = ref<userFormat[]>([])
  
  // Add some generic users to the array
  
  users.value.push({
    userId: 1,
    username: 'rbcca',
    firstName: 'Rebecca',
    lastName: 'Workentheen',
    email: 'rbcca@newpaltz.edu',
    isAdmin: false
  })

  users.value.push({
    userId: 2,
    username: 'damor',
    firstName: 'Daniel',
    lastName: 'Amoruso',
    email: 'damor@newpaltz.edu',
    isAdmin: true
  })