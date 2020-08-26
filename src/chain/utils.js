import CKB from '@nervosnetwork/ckb-sdk-core';
import {
  hexToBytes as CKBHexToBytes,
  serializeWitnessArgs,
  fullPayloadToAddress,
  AddressPrefix,
  AddressType,
  bech32Address,
  scriptToHash,
  parseAddress
} from '@nervosnetwork/ckb-sdk-utils';
import { sha3, hexToNumber, bytesToHex, hexToBytes, keccak256, numberToHex } from 'web3-utils';
import ecc from 'eosjs-ecc';
import querystring from 'querystring';
import Axios from 'axios';
import { CELLAPI_URL, blockAssemblerCode, tronLockCell, eosLockCell, multiSigTypeId } from './config';



const httpClient = Axios.create();
export async function getUnspentCell(lockHash) {
  const args = {
    capacity: numberToHex(150000 * 10 ** 8),
    lockHash,
  };

  const params = querystring.stringify(args);
  const url = CELLAPI_URL+ '/cell/unSpent?' + params;
  console.log('url', url);

  const response = await httpClient.get(url);
  // console.log(response.data);

  return response.data.data;
}

export async function getBalance(lockHash) {

  const args = {
    lockHash,
  };

  const params = querystring.stringify(args);
  const url = CELLAPI_URL+ '/cell/getCapacityByLockHash?' + params;
  // console.log('url', url);

  const response = await httpClient.get(url);
  const balanceHex = response.data.data;

  const balance = Number(balanceHex)
  // console.log('balance', balance)
  const balanceStr = balance / 10 ** 8
  return balanceStr;
}



export const lockScriptToAddress = (script, prefix) => {
  const { codeHash, hashType, args } = script;

  const type = hashType === 'type' ? AddressType.TypeCodeHash : AddressType.DataCodeHash;

  if (codeHash === blockAssemblerCode && hashType === 'type') {
    return bech32Address(args, {
      prefix,
      type: AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    });
  }


  if (codeHash === multiSigTypeId && hashType === 'type') {
    return bech32Address(args, {
      prefix,
      type: AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x01',
    });
  }

  return fullPayloadToAddress({
    args,
    prefix,
    codeHash,
    type,
  });
};


export const addressToLockScript = (address) => {
  const data = parseAddress(address, 'hex').replace('0x', '');
  const type = `0x${data.substr(0, 2)}`;

  let codeHash = '';
  let hashType = '';
  let args = '';

  if (type === AddressType.TypeCodeHash) {
    hashType = 'type';
    codeHash = '0x' + data.substr(2, 64);
    args = '0x' + data.substr(66);
  } else if (type === AddressType.DataCodeHash) {
    hashType = 'data';
    codeHash = '0x' + data.substr(2, 64);
    args = '0x' + data.substr(66);
  } else if (type === AddressType.HashIdx) {

    codeHash = blockAssemblerCode;
    const subType = data.substr(2, 2);
    if (subType === '00') {
      codeHash = blockAssemblerCode;
    } else if (subType === '01') {
      codeHash = multiSigTypeId;
    } else {
      throw new Error('parse address failed');
    }

    hashType = 'type';
    args = '0x' + data.substr(4);
  }

  return { codeHash, hashType, args };
};

export function convertEOSPubKeyToEthAddress (EOSPubKey) {
  
  const publicKeyHex = ecc.PublicKey(EOSPubKey).toUncompressed().toBuffer().toString('hex');
  //049a28e98f697d604661dc982f63a20d2b7f6701aef0ab1cc62acc995fd6deb190a4d71e5aeb30dbc039cadbd1783739a9e7a4851a753cbb58243a862689afe8fb
  // console.log('public key', publicKeyHex);
  //03a0448b1aab081c3a6c84a1def7a1924eda46814bc366e87095fb4daec9b541b5
  const publicHash = keccak256('0x' + publicKeyHex.slice(2))
  // console.log('public hash', publicHash);
  const address = '0x' + publicHash.slice(-40);
  console.log('ethaddress', EOSPubKey, address);
  return address;
}

export function convertEOSPubKeyToCKBAddress (EOSPubKey) {
  const codeHash = scriptToHash(eosLockCell.type);
  const args = convertEOSPubKeyToEthAddress(EOSPubKey);
  console.log('codeHash', codeHash);
  const lock = {
    codeHash,
    hashType: 'type',
    args,
  };

  return lockScriptToAddress(lock, 'ckt');
}

export function convertTronAddressToArgs (tronWeb, tronAddress) {
  const addressHex = tronWeb.address.toHex(tronAddress);
  const args = '0x' + addressHex.substring(2);
  return args;
}

export function convertTronAddressToCKBAddress (tronWeb, tronAddress) {
  const addressHex = tronWeb.address.toHex(tronAddress);
  const args = '0x' + addressHex.substring(2);
  const lock = {
    codeHash: scriptToHash(tronLockCell.type),
    hashType: 'type',
    args,
  };
  return lockScriptToAddress(lock, 'ckt');
}

export function changeOutputLock(tx, oldLockHash, newLock) {
  for (const output of tx.outputs) {
    if (scriptToHash(output.lock) === oldLockHash) {
      output.lock = newLock;
    }
  }
}

String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


export function mergeTypedArraysUnsafe(a, b) {
  return [...a, ...b];
}

export function processEosHash(a) {
  let str = a.replace('0x', '');
  str = str.splice(12, 0, ' ');
  str = str.splice(12 * 2 + 1, 0, ' ');
  str = str.splice(12 * 3 + 2, 0, ' ');
  str = str.splice(12 * 4 + 3, 0, ' ');
  str = str.splice(12 * 5 + 4, 0, ' ');
  console.log('processEosHash', a);
  console.log('processEosHash', str);
  return str;
}