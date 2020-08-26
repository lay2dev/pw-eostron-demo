<template>
  <div class="hello">
    <h1>CKB with EOSWallet </h1>

    <!-- <button @click="connect">connect</button> -->

    <button @click="login">login</button>

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

     <br/>
    <br/>
  </div>
</template>

<script>
import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { JsonRpc, Api } from 'eosjs'
import ecc from 'eosjs-ecc'
import { convertEOSPubKeyToCKBAddress, getBalance, addressToLockScript } from '../chain/utils'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import Secp256Eos from '../chain/ckb-eos'

import VConsole from 'vconsole'
var vConsole = new VConsole()

const network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  host: 'nodes.get-scatter.com',
  port: 443,
  protocol: 'https',
})

const rpc = new JsonRpc(network.fullhost())

const requiredFields = { accounts: [network] }

let scatter = ''
let api = ''

let secp256Eos = ''

ScatterJS.plugins(new ScatterEOS())

export default {
  name: 'HelloWorld',
  data() {
    return {
      currentAccount: '',
      currentPermission: '',
      currentPublicKey: '',
      currentCKBAddress: '',
      currentCKBBalance: '0',
      toAccount: 'sking1234512',
      toAccountPublicKey: '',
      toCKBAddress: '',
      toCKBBalance: '0',
    }
  },
  created() {
    ScatterJS.scatter.connect('scatter-demo', { network }).then((connected) => {
      if (!connected) {
        alert('no connect')
        return false
      }

      console.log('connected')
      scatter = ScatterJS.scatter
      console.log('scatter', scatter)
      secp256Eos = new Secp256Eos(scatter)
    })
  },

  methods: {
    connect: function() {
      ScatterJS.scatter.connect('scatter-demo').then((connected) => {
        if (!connected) {
          alert('no connect')
          return false
        }

        // alert('connected')
        // scatter = ScatterJS.scatter;
      })
    },
    logout: function() {
      if (!this.currentAccount) {
        alert('login first')
        return
      }
      scatter.logout().then((a) => alert(a))
    },
    login: async function() {
      try {
        const id = await scatter.login()
        const account = scatter.identity.accounts.find((x) => x.blockchain === 'eos')

        this.currentAccount = account.name
        this.currentPermission = account.authority
        this.currentPublicKey = account.publicKey
        this.currentCKBAddress = convertEOSPubKeyToCKBAddress(this.currentPublicKey)

        // alert('get account:' + JSON.stringify(account))
        console.log('get account:' + JSON.stringify(account))

        api = scatter.eos(network, Api, { rpc })

        const data = await rpc.get_account(this.toAccount)
        const pubkey = data.permissions[0].required_auth.keys[0].key
        console.log('account2 pubKey', pubkey)
        this.toAccountPublicKey = pubkey
        this.toCKBAddress = convertEOSPubKeyToCKBAddress(pubkey)

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
        this.currentCKBBalance = await getBalance(scriptToHash(addressToLockScript(this.currentCKBAddress)))
        this.toCKBBalance = await getBalance(scriptToHash(addressToLockScript(this.toCKBAddress)))
    },

    getArbitrarySignature: async function() {
      try{
        const txhash = await secp256Eos.sendCKB(this.currentPublicKey, this.toAccountPublicKey, 100)
        alert('send Success, txHash=' + txhash);
        console.log('send Success, txHash=' + txhash);

      }catch(err){
        alert('send err' + err);
        console.log(err);
      }

      // const dataToSign = 'dataToSign';
      // scatter.getArbitrarySignature(this.currentPublicKey, dataToSign).then(signature=> {
      //   alert(signature);
      //   const verifyRet = ecc.verify(signature, dataToSign, this.currentPublicKey);
      //   console.log('verifyRet', verifyRet);
      //   const recovered = ecc.recover(signature, dataToSign);
      //   console.log('recovered', recovered);
      //   console.log('pubKey', this.currentPublicKey);

      // }).catch(err =>{
      //   console.log('err', err);
      //   alert('error:' + err);
      // });
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
