<template>
  <div class="home">
    <img alt="Pwallet logo" style="height:30px;" src="../assets/logo.png">
    <span> <a @click="goEos" href="#">EOS</a> &nbsp;&nbsp;</span>
    <span> <a href="https://faucet.nervos.org/">faucet</a> </span>
    <Tronlink/>
  </div>
</template>

<script>
// @ is an alias to /src
import Tronlink from "@/components/Tronlink.vue";

export default {
  name: "tron",
  components: {
    Tronlink
  },
  methods: {
    goEos: function(){
      this.$router.push({path: '/eos'})
      console.log('eos');
    }
  }
};
</script>
