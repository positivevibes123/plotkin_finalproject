import {ref} from 'vue'

// Handling user activities (maybe move to a separate file...)

type activityFormat = {
    userId: number,
    description: string
    date: string
    duration: number
    distance: number
    location: string
  }
  
  // We must definte a format here, because if ref sees the array is empty (no params) it assumes it should ALWAYS be empty
  const activities = ref<activityFormat[]>([])

  export function refActivities() {
    return activities;
  }

  export function addActivity(userId : number, desc : string, date : string, duration: number, distance: number, loc : string) {
    const activityObject = {
      userId: userId,
      description: desc,
      date: date,
      duration: duration,
      distance: distance,
      location: loc,
    };
  
    // Add the activity to the array of activities to be displayed
    activities.value.push(activityObject);
  }

  export function removeActivity(index: number) {
    activities.value.splice(index, 1);
  }

  export function getActivitiesByUserId(userId: number) {
    return activities.value.filter(activity => activity.userId === userId);
  }

  export function getActivitiesExcludingUserId(userId: number) {
    return activities.value.filter(activity => activity.userId !== userId);
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

  export function refUsers() {
    return users;
  }

  export function addUser(username: string, firstName: string, lastName: string, email: string, isAdmin: boolean) {
    const userObject = {
      userId: users.value.length + 1,
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      isAdmin: isAdmin
    };

    // Add the user to the array of users
    users.value.push(userObject);
  }
  
  export function removeUser(userId: number) {
    const index = users.value.findIndex(user => user.userId === userId);
    users.value.splice(index, 1);
  }

  export function getUserById(id: number) {
    return users.value.find(user => user.userId === id);
  }

  export function getFullName(userId: number) {
    const user = getUserById(userId);
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  export function getUsersExcludingUserId(userId: number) {
    return users.value.filter(user => user.userId !== userId);
  }

  const signedInUserId = ref(0);

  export function refSignedInUserId() {
    return signedInUserId;
  }

  export function isSignedInUserAdmin() {
    return getUserById(signedInUserId.value)?.isAdmin;
  }
  
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
    username: 'inunez',
    firstName: 'Ivan',
    lastName: 'Noonez',
    email: 'ivan@newpaltz.edu',
    isAdmin: false
  })

  users.value.push({
    userId: 3,
    username: 'damor',
    firstName: 'Daniel',
    lastName: 'Amoruso',
    email: 'damor@newpaltz.edu',
    isAdmin: true
  })