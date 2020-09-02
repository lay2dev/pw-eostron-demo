export const CELLAPI_URL = 'https://cellapitest.ckb.pw'
export const CKB_NODE_URL = 'https://aggron.ckb.dev';

const EOS_ARG = '0xf6d90bfe3041d0fd7e01c45770241697f5f837974bd6ae1672a7ec0f9f523268';
const EOS_TXHASH = '0x57a62003daeab9d54aa29b944fc3b451213a5ebdf2e232216a3cfed0dde61b38';

const TRON_ARG = '0xf6d90bfe3041d0fd7e01c45770241697f5f837974bd6ae1672a7ec0f9f523268';
const TRON_TXHASH = '0x57a62003daeab9d54aa29b944fc3b451213a5ebdf2e232216a3cfed0dde61b38';

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