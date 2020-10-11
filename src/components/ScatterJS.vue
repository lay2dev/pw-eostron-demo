<template>
  <div class="hello">
    <h1>CKB with EOSWallet</h1>

    <!-- <button @click="connect">connect</button> -->

    <!-- <button @click="login">login</button> -->

    <!-- <button @click="logout">logout</button> -->

    <p>EOS account: {{ currentAccount }}</p>
    <p style="word-break:break-all;">CKB Address: {{ currentCKBAddress }}</p>
    <p>Balance: {{ currentCKBBalance }} CKB</p>

    <br />

    <!-- <button @click="getPubkey">getPubkey</button>

    <button @click="account">account('eos')</button>

    <button @click="linkAccount">linkAccount</button>
    <br />

    <button @click="transfer()">transfer</button>

    <button @click="stake()">stake cpu</button>
    <br />
    <button @click="requestTransfer">requestTransfer</button>
    <button @click="getIdentityFromPermissions">getIdentityFromPermissions</button> -->

    <br />
    <!-- <button @click="authenticate()">authenticate</button> -->

    <button @click="getArbitrarySignature()">Send 100 CKB</button>
    <p>To: {{ toAccount }}</p>
    <p style="word-break:break-all;">CKB Address: {{ toCKBAddress }}</p>
    <p>Balance: {{ toCKBBalance }} CKB</p>

    <br />
    <br />
  </div>
</template>

<script>
import PWCore, {
  PwCollector,
  ChainID,
  Address,
  Amount,
  AddressType,
  EosSigner,
  EosProvider,
  getCKBLockArgsForEosAccount,
} from '@lay2/pw-core'

import VConsole from 'vconsole'
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
      toAccount: 'sking1234512',
      toCKBAddress: '',
      toCKBBalance: '0',
    }
  },
  async created() {
    this.login()
  },

  methods: {
    connect: function() {
      // alert('connected')
      // scatter = ScatterJS.scatter;
    },
    login: async function() {
      const network = {
        blockchain: 'eos',
        chainId:
          'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        host: 'eospush.tokenpocket.pro',
        port: 443,
        protocol: 'https',
      }
      try {
        const eosProvider = new EosProvider(network)
        pwcore = await new PWCore('https://aggron.ckb.dev').init(
          eosProvider,
          new PwCollector('https://cellapitest.ckb.pw')
        )
        this.currentAccount = PWCore.provider.address.addressString
        this.currentCKBAddress = PWCore.provider.address.toCKBAddress()

        const toAddressLockArgs = await eosProvider.getCKBLockArgsForEosAccount(
          this.toAccount
        )
        toAddress = new Address(
          this.toAccount,
          AddressType.eos,
          toAddressLockArgs
        )
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
      this.currentCKBBalance = await PWCore.defaultCollector.getBalance(
        PWCore.provider.address
      )
      this.toCKBBalance = await PWCore.defaultCollector.getBalance(toAddress)
    },

    getArbitrarySignature: async function() {
      try {
        const txhash = await pwcore.send(toAddress, new Amount('100'))
        alert('send Success, txHash=' + txhash)
        console.log('send Success, txHash=' + txhash)
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
