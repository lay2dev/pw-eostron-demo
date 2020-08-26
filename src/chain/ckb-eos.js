import CKB from '@nervosnetwork/ckb-sdk-core';
import {
  hexToBytes as CKBHexToBytes,
  serializeWitnessArgs,
  // toHexInLittleEndian,
  toUint64Le,
  fullPayloadToAddress,
  AddressPrefix,
  AddressType,
  bech32Address,
  scriptToHash,
  parseAddress,
} from '@nervosnetwork/ckb-sdk-utils';
import { sha3, hexToNumber, bytesToHex, hexToBytes, keccak256 } from 'web3-utils';
import ecc from 'eosjs-ecc'
import { convertEOSPubKeyToEthAddress, getUnspentCell, changeOutputLock, mergeTypedArraysUnsafe, processEosHash } from './utils';
import { CKB_NODE_URL, eosLockCell, blockAssemblerCode } from './config';


export default class Secp256EOS {
  ckb;
  scatter;
  constructor(scatter) {
    this.ckb = new CKB(CKB_NODE_URL);
    this.scatter = scatter;
    console.log('Secp256EOS initialized');
  }


  async sendCKB (fromPubKey, toPubKey, capacity) {

    const fromArgs = convertEOSPubKeyToEthAddress(fromPubKey);
    const toArgs = convertEOSPubKeyToEthAddress(toPubKey);

    const { secp256k1Dep } = await this.ckb.loadDeps();
  
    const inputLockHash = scriptToHash({
      codeHash: scriptToHash(eosLockCell.type),
      hashType: 'type',
      args: fromArgs,
    });

    const unspentCells = await getUnspentCell(inputLockHash);

    const fakedCKBAddress = 'ckt1qyqgkx886pp39pn92x2m32vcg4p3ly7xwausx4s69v';
  
    const rawTx = this.ckb.generateRawTransaction({
      fromAddress: fakedCKBAddress,
      toAddress: fakedCKBAddress,
      capacity: BigInt(capacity * 10 ** 8),
      fee: BigInt(100000),
      cells: unspentCells,
      deps: secp256k1Dep,
      safeMode: true,
    });

    rawTx.outputs[0].lock = {
      codeHash: scriptToHash(eosLockCell.type),
      hashType: 'type',
      args: toArgs,
    };
  
    const oldOutputLock = {
      codeHash: blockAssemblerCode,
      hashType: 'type',
      args: `0x${parseAddress(fakedCKBAddress, 'hex').slice(6)}`,
    };
    const oldOutputLockHash = scriptToHash(oldOutputLock);
    const newOutputLock = {
      codeHash: scriptToHash(eosLockCell.type),
      hashType: 'type',
      args: fromArgs,
    };
    changeOutputLock (rawTx, oldOutputLockHash, newOutputLock);
  
    rawTx.cellDeps.push({ outPoint: eosLockCell.outPoint, depType: 'code' });
  
    rawTx.witnesses = rawTx.inputs.map(() => '0x');
    rawTx.witnesses[0] = { lock: '', inputType: '', outputType: '' };

  
    const signedTx = await this.signTransaction(fromPubKey, unspentCells, rawTx);

    console.dir(signedTx);

  
    const realTxHash = await this.ckb.rpc.sendTransaction(signedTx);
    console.log(`The real transaction hash is: ${realTxHash}`);

    return realTxHash;
  }
  

  async signTransaction(fromPubKey, cells, rawTx) {
    const transactionHash = this.ckb.utils.rawTransactionToHash(rawTx);

    console.log('rawTransaction', rawTx);
    console.log('txhash', transactionHash);
    const emptyWitness = {
      ...(rawTx.witnesses[0]),
      lock: `0x${'0'.repeat(130)}`,
    };

    const serializedEmptyWitnessBytes = hexToBytes(serializeWitnessArgs(emptyWitness));
    const serialziedEmptyWitnessSize = serializedEmptyWitnessBytes.length;
    console.log('serialziedEmptyWitnessSize', serialziedEmptyWitnessSize);

    // Calculate keccak256 hash for rawTransaction
    let hashBytes = hexToBytes(transactionHash);
    console.log('hashBytes1', hashBytes);
    hashBytes = mergeTypedArraysUnsafe(
      hashBytes,
      hexToBytes(toUint64Le(`0x${serialziedEmptyWitnessSize.toString(16)}`))
    );
    hashBytes = mergeTypedArraysUnsafe(hashBytes, serializedEmptyWitnessBytes);

    console.log('hashBytes2', bytesToHex(hashBytes));

    rawTx.witnesses.slice(1).forEach(w => {
      const bytes = hexToBytes(typeof w === 'string' ? w : serializeWitnessArgs(w));
      hashBytes = mergeTypedArraysUnsafe(
        hashBytes,
        hexToBytes(toUint64Le(`0x${bytes.length.toString(16)}`))
      );
      hashBytes = mergeTypedArraysUnsafe(hashBytes, bytes);
    });

    console.log('hashBytes3', bytesToHex(hashBytes));

    let message = sha3(bytesToHex(hashBytes));

    console.log('baseMessage', message);
    // const sig = ecc.sign(, pkeyWif);

    const sig = await this.scatter.getArbitrarySignature(fromPubKey, processEosHash(message))
    console.log('eos sig', sig);

    const sigObj = ecc.Signature.from(sig);
    sigObj.i -= 27;
    sigObj.i &= 3;
    const buf = new Buffer(65);
    sigObj.r.toBuffer(32).copy(buf, 0);
    sigObj.s.toBuffer(32).copy(buf, 32);
    buf.writeUInt8(sigObj.i, 64);
    const signatureHexString = '0x' + buf.toString('hex');

    console.log('signatureHexString', signatureHexString);

    emptyWitness.lock = signatureHexString;

    const signedWitnesses = [serializeWitnessArgs(emptyWitness), ...rawTx.witnesses.slice(1)];
    const tx = {
      ...rawTx,
      witnesses: signedWitnesses.map(witness =>
        typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
      ),
    };

    return tx;
  }
}
