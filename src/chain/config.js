export const CELLAPI_URL = 'https://cellapitset.ckb.pw'
export const CKB_NODE_URL = 'https://aggron.ckb.dev';

const EOS_ARG = 0x0f9f2769fd63d1c7bf6447dc9f2b4cfbc7daf1e17be427674247c95e70e01379
const EOS_TXHASH = 0x591a59c053ac1737f190f985329ca3213dde5fb9376c6107fac9e445434da4ca

const TRON_ARG = 0x0f9f2769fd63d1c7bf6447dc9f2b4cfbc7daf1e17be427674247c95e70e01379
const TRON_TXHASH = 0x591a59c053ac1737f190f985329ca3213dde5fb9376c6107fac9e445434da4ca


export const eosLockCell = {
  type: {
    codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
    hashType: 'type',
    args: EOS_ARG
  },
  outPoint: {
    txHash: EOS_TXHASH,
    index: '0x0',
  },
};

export const tronLockCell = {
  type: {
    codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
    hashType: 'type',
    args: TRON_ARG,
  },
  outPoint: {
    txHash: TRON_TXHASH,
    index: '0x0',
  },

};

export const blockAssemblerCode = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8';
export const multiSigTypeId = '0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8';