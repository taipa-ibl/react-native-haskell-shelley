use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
// use super::string::ToJniString;
use crate::panic::{handle_exception_result};
use crate::ptr::RPtrRepresentable;
use jni::objects::JObject;
use jni::sys::{jobject, jint};
use jni::JNIEnv;
use cddl_lib::crypto::{AddrKeyHash};
use cddl_lib::address::{StakeCredential};

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_io_emurgo_rnhaskellshelley_Native_stakeCredentialFromKeyHash(
  env: JNIEnv, _: JObject, key_hash_ptr: JRPtr
) -> jobject {
  handle_exception_result(|| {
    let key_hash = key_hash_ptr.owned::<AddrKeyHash>(&env)?;
    let stake_credential = StakeCredential::from_keyhash(key_hash);
    stake_credential.rptr().jptr(&env)
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_io_emurgo_rnhaskellshelley_Native_stakeCredentialToKeyHash(
  env: JNIEnv, _: JObject, ptr: JRPtr
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr.typed_ref::<StakeCredential>().and_then(|stake_credential| stake_credential.to_keyhash().rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_io_emurgo_rnhaskellshelley_Native_stakeCredentialKind(
  env: JNIEnv, _: JObject, ptr: JRPtr
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<StakeCredential>()
      .map(|credential| credential.kind())
      .and_then(|kind| (kind as jint).jobject(&env))
      // .and_then(|kind| kind.into_jlong().jobject(&env))
  })
  .jresult(&env)
}