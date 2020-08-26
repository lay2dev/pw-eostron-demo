<template>
  <div class="hello">
    <h1>CKB with TronWallet </h1>

    <p>Tron address: {{ currentAccount }}</p>
    <p style="word-break:break-all;">CKB Address: {{ currentCKBAddress }}</p>
    <p>Balance: {{ currentCKBBalance }} CKB</p>

    <br />

    <br />

    <button @click="getArbitrarySignature()">Send 100 CKB</button>
    <p>To: {{ toAccount }}</p>
    <p style="word-break:break-all;">CKB Address: {{ toCKBAddress }}</p>
    <p>Balance: {{ toCKBBalance }} CKB</p>
    <br/>
    <br/>
  </div>
</template>

<script>
import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { JsonRpc, Api } from 'eosjs'
import ecc from 'eosjs-ecc'
import { convertEOSPubKeyToCKBAddress, getBalance, addressToLockScript, convertTronAddressToCKBAddress } from '../chain/utils'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import Secp256Tron from '../chain/ckb-tron'

import VConsole from 'vconsole'
var vConsole = new VConsole()

let scatter = ''
let api = ''

let secp256Tron = ''

export default {
  name: 'HelloWorld',
  data() {
    return {
      currentAccount: '',
      currentCKBAddress: '',
      currentCKBBalance: '0',
      toAccount: 'THk42UJEK816GgWektkzzfohaiPJCXxb8k',
      toCKBAddress: '',
      toCKBBalance: '0',
    }
  },
  created() {

    if(!window.tronWeb){
      alert('tronWeb load fail');
    }else{

      if(!window.tronWeb.defaultAddress || !window.tronWeb.defaultAddress.base58){
        alert('load tron address fail');
        return;
      }

      this.currentAccount = window.tronWeb.defaultAddress.base58;
      secp256Tron = new Secp256Tron(window.tronWeb);

      this.login();
    }
  },

  methods: {
    login: async function() {
      try {

        this.currentCKBAddress = convertTronAddressToCKBAddress(window.tronWeb, this.currentAccount);
        this.toCKBAddress = convertTronAddressToCKBAddress(window.tronWeb, this.toAccount)
        await this.getBalance();

        const timeOutFunc = () => {
          this.getBalance();
          setTimeout(timeOutFunc, 2000)
        }
        timeOutFunc();

      } catch (error) {
        alert('get identity error')
        console.error(error)
      }
    },
    getBalance: async function(){
        this.currentAccount = window.tronWeb.defaultAddress.base58;
        this.currentCKBAddress = convertTronAddressToCKBAddress(window.tronWeb, this.currentAccount);

        this.currentCKBBalance = await getBalance(scriptToHash(addressToLockScript(this.currentCKBAddress)))
        this.toCKBBalance = await getBalance(scriptToHash(addressToLockScript(this.toCKBAddress)))
    },

    getArbitrarySignature: async function() {
      try{
        const txhash = await secp256Tron.sendCKB(this.currentAccount, this.toAccount, 100)
        alert('send Success, txHash=' + txhash);

      }catch(err){
        alert('send err' + err);
        console.log(err);
      }

    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

button {
  margin: 10px;
  padding: 8px 20px;
  background-color: #efefef;
  border-radius: 30px;
  outline: none;
  border: none;
}
</style>
