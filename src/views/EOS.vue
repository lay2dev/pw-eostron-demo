<template>
  <div class="home">
    <a href="#"></a>
    <img alt="Pwallet logo" style="height:30px;" src="../assets/logo.png">
    <span> <a @click="goTron" href="#">TRON</a> &nbsp;&nbsp;</span>
    <span> <a href="https://faucet.nervos.org/">faucet</a> </span>
    <ScatterJS/>
  </div>
</template>

<script>
// @ is an alias to /src
import ScatterJS from "@/components/ScatterJS.vue";

export default {
  name: "eos",
  components: {
    ScatterJS
  },
  methods: {
    goTron: function(){
      console.log('goTron');
      this.$router.push({path: '/tron'});
    },
  }
};
</script>
