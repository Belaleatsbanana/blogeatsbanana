<template>
    <svg xmlns="http://www.w3.org/2000/svg" :height="height" viewBox="0 -960 960 960" :width="width">
        <path
            d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"
            :fill="fillColor" :stroke="strokeColor" stroke-width="75" />
    </svg>



</template>



<script setup lang="ts">

defineProps({
    width: {
        type: String,
        default: '25px'
    },
    height: {
        type: String,
        default: '25px'
    },
    fillColor: {
        type: String,
        default: '#000000'
    },
    strokeColor: {
        type: String,
        default: '#000000'
    }
});
</script>

<style scoped></style>