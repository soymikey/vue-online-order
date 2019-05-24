<template>
  <div class="diaglog">
    <!-- Form -->

  </div>
</template>


<script>
export default {
  data() {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  }
}
</script>
