use crate::utils::ToFromBytes;
use super::utils::{to_bytes, from_bytes};
use super::data::DataPtr;
use super::string::{CharPtr};
use crate::ptr::{RPtr};
use cardano_serialization_lib::error::{DeserializeError};
use cardano_serialization_lib::{TransactionBody};

impl ToFromBytes for TransactionBody {
  fn to_bytes(&self) -> Vec<u8> {
    self.to_bytes()
  }

  fn from_bytes(bytes: Vec<u8>) -> Result<TransactionBody, DeserializeError> {
    TransactionBody::from_bytes(bytes)
  }

}

#[no_mangle]
pub unsafe extern "C" fn transaction_body_to_bytes(
  transaction_body: RPtr, result: &mut DataPtr, error: &mut CharPtr
) -> bool {
  to_bytes::<TransactionBody>(transaction_body, result, error)
}

#[no_mangle]
pub unsafe extern "C" fn transaction_body_from_bytes(
  data: *const u8, len: usize, result: &mut RPtr, error: &mut CharPtr
) -> bool {
  from_bytes::<TransactionBody>(data, len, result, error)
}
