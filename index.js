import { NativeModules } from 'react-native';
import { decode as base64_decode, encode as base64_encode } from 'base-64';

const { HaskellShelley } = NativeModules;

// export default HaskellShelley;

function Uint8ArrayFromB64(base64_string) {
    return Uint8Array.from(base64_decode(base64_string), c => c.charCodeAt(0));
}

function b64FromUint8Array(uint8Array) {
    return base64_encode(String.fromCharCode.apply(null, uint8Array));
}


class Ptr {
    static _wrap(ptr, klass) {
        if (ptr === '0') {
            return undefined;
        }
        const obj = Object.create(klass.prototype);
        obj.ptr = ptr;
        return obj;
    }

    static _assertClass(ptr, klass) {
        if (!(ptr instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
        return ptr.ptr;
    }

    constructor() {
        throw new Error("Can't be initialized with constructor");
    }

    /**
    * Frees the pointer
    * @returns {Promise<void>}
    */
    async free() {
        if (!this.ptr) {
            return;
        }
        const ptr = this.ptr;
        this.ptr = null;
        await HaskellShelley.ptrFree(ptr);
    }
}

// NOT SUPPORTED
export class Address extends Ptr {

    /**
    * @param {Uint8Array} bytes
    * @returns {Promise<Address>}
    */
    static async from_bytes(bytes) {
        const ret = await HaskellShelley.addressFromBytes(b64FromUint8Array(bytes));
        return Ptr._wrap(ret, Address);
    }

    /**
    * @returns {Promise<Uint8Array>}
    */
    async to_bytes() {
        const b64 = await HaskellShelley.addressToBytes(this.ptr);
        return Uint8ArrayFromB64(b64);
    }

}

export class AddrKeyHash extends Ptr {

  /**
  * @param {Uint8Array} bytes
  * @returns {Promise<AddrKeyHash>}
  */
  static async from_bytes(bytes) {
    const ret = await HaskellShelley.addrKeyHashFromBytes(b64FromUint8Array(bytes));
    return Ptr._wrap(ret, AddrKeyHash);
  }

  /**
  * @returns {Promise<Uint8Array>}
  */
  async to_bytes() {
      const b64 = await HaskellShelley.addrKeyHashToBytes(this.ptr);
      return Uint8ArrayFromB64(b64);
  }
}

export class StakeCredential extends Ptr {

  /**
  * @param {AddrKeyHash} hash
  * @returns {Promise<StakeCredential>}
  */
  static async from_keyhash(hash) {
    const addrKeyHashPtr = Ptr._assertClass(key, AddrKeyHash);
    const ret = await HaskellShelley.stakeCredentialFromKeyHash(addrKeyHashPtr);
    return Ptr._wrap(ret, StakeCredential);
  }
}

export class BaseAddress extends Ptr {

  /**
  * @param {number} network
  * @param {StakeCredential} payment
  * @param {StakeCredential} stake
  * @returns {Promise<BaseAddress>}
  */
  static async new(network, payment, stake) {
      const paymentPtr = Ptr._assertClass(key, StakeCredential);
      const stakePtr = Ptr._assertClass(key, StakeCredential);
      const ret = await HaskellShelley.baseAddressNew(network, paymentPtr, stakePtr);
      return Ptr._wrap(ret, BaseAddress);
  }
}