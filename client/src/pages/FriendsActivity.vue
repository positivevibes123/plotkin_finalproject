<script setup lang="ts">
    import { ref } from 'vue';
    type activityFormat = {
        name: string;
        description: string;
        date: string;
        time: string;
        location: string;
    };

    // We must definte a format here, because if ref sees the array is empty (no params) it assumes it should ALWAYS be empty
    const data = ref<activityFormat[]>([]);
    
    const addActivity = () => {
        const activityObject = {
        name: 'Activity Name',
        description: 'Activity Description',
        date: 'Activity Date',
        time: 'Activity Time',
        location: 'Activity Location'
    };
        
        data.value.push(activityObject);
        console.log(data.value[data.value.length - 1])
    }
</script>

<template>
    <div class="container">
        <h1 class="title">Friends Activity</h1>
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <button @click="addActivity" class="button is-info is-fullwidth">Add Activity</button>
                <br>
                <div>
                    
                </div>
            </div>
        </div>
    </div>
</template>