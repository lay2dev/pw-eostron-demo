export const CELLAPI_URL = 'https://cellapitest.ckb.pw'
export const CKB_NODE_URL = 'https://aggron.ckb.dev';

const EOS_ARG = '0xf42d2fbf79729f70098d60d014c9ab5c6901bbe3dadb45e681c3f0a55ed56746';
const EOS_TXHASH = '0xca7549786315cf47453dc5cb203e99bfd4aabe2bfc9e6f34601ccb0940a8c72b';

const TRON_ARG = '0x0f9f2769fd63d1c7bf6447dc9f2b4cfbc7daf1e17be427674247c95e70e01379';
const TRON_TXHASH = '0x591a59c053ac1737f190f985329ca3213dde5fb9376c6107fac9e445434da4ca';

export const secp256k1Dep = {
  hashType: 'type',
  codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  outPoint: {
    txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
    index: '0x0',
  },
};


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