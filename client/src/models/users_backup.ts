import {ref} from 'vue'

// Handling user activities (maybe move to a separate file...)

type activityFormat = {
    userid: number,
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

  export function addActivity(userid : number, desc : string, date : string, duration: number, distance: number, loc : string) {
    const activityObject = {
      userid: userid,
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

  export function getActivitiesByUserId(userid: number) {
    return activities.value.filter(activity => activity.userid === userid);
  }

  export function getActivitiesExcludingUserId(userid: number) {
    return activities.value.filter(activity => activity.userid !== userid);
  }

  // Handling users

  type userFormat = {
    userid: number
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
      userid: users.value.length + 1,
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      isAdmin: isAdmin
    };

    // Add the user to the array of users
    users.value.push(userObject);
  }
  
  export function removeUser(userid: number) {
    const index = users.value.findIndex(user => user.userid === userid);
    users.value.splice(index, 1);
  }

  export function getUserById(id: number) {
    return users.value.find(user => user.userid === id);
  }

  export function getFullName(userid: number) {
    const user = getUserById(userid);
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  export function getUsersExcludingUserId(userid: number) {
    return users.value.filter(user => user.userid !== userid);
  }

  const signedInUserid = ref(0);

  export function refSignedInUserId() {
    return signedInUserid;
  }

  export function isSignedInUserAdmin() {
    return getUserById(signedInUserid.value)?.isAdmin;
  }
  
  // Add some generic users to the array
  
  users.value.push({
    userid: 1,
    username: 'rbcca',
    firstName: 'Rebecca',
    lastName: 'Workentheen',
    email: 'rbcca@newpaltz.edu',
    isAdmin: false
  })

  users.value.push({
    userid: 2,
    username: 'inunez',
    firstName: 'Ivan',
    lastName: 'Noonez',
    email: 'ivan@newpaltz.edu',
    isAdmin: false
  })

  users.value.push({
    userid: 3,
    username: 'damor',
    firstName: 'Daniel',
    lastName: 'Amoruso',
    email: 'damor@newpaltz.edu',
    isAdmin: true
  })
