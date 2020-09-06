<template>
  <div class="hello">
    <h1>CKB with TronWallet</h1>

    <p>Tron address: {{ currentAccount }}</p>
    <p style="word-break:break-all;">CKB Address: {{ currentCKBAddress }}</p>
    <p>Balance: {{ currentCKBBalance }} CKB</p>

    <br />

    <br />

    <button @click="getArbitrarySignature()">Send 100 CKB</button>
    <p>To: {{ toAccount }}</p>
    <p style="word-break:break-all;">CKB Address: {{ toCKBAddress }}</p>
    <p>Balance: {{ toCKBBalance }} CKB</p>
    <br />
    <br />
  </div>
</template>

<script>
import VConsole from 'vconsole'
import PWCore, { Address, AddressType, PwCollector, TronProvider, Amount } from '@lay2/pw-core'
var vConsole = new VConsole()

let pwcore

let toAddress

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
    this.login()
  },

  methods: {
    login: async function() {
      try {
        pwcore = await new PWCore('https://aggron.ckb.dev').init(
          new TronProvider(),
          new PwCollector('https://cellapitest.ckb.pw')
        )

        this.currentAccount = PWCore.provider.address.addressString
        this.currentCKBAddress = PWCore.provider.address.toCKBAddress()

        toAddress = new Address(this.toAccount, AddressType.tron)
        this.toCKBAddress = toAddress.toCKBAddress()

        await this.getBalance()

        const timeOutFunc = () => {
          this.getBalance()
          setTimeout(timeOutFunc, 2000)
        }
        timeOutFunc()
      } catch (error) {
        alert('get identity error')
        console.error(error)
      }
    },
    getBalance: async function() {
      this.currentCKBBalance = await PWCore.defaultCollector.getBalance(PWCore.provider.address)
      this.toCKBBalance = await PWCore.defaultCollector.getBalance(toAddress)
    },

    getArbitrarySignature: async function() {
      try {
        // const txhash = await secp256Tron.sendCKB(this.currentAccount, this.toAccount, 100)
        const txhash = await pwcore.send(toAddress, new Amount('100'))
        alert('send Success, txHash=' + txhash)
      } catch (err) {
        alert('send err' + err)
        console.log(err)
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
