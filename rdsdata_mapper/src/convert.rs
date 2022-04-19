use crate::error::MappingError;
use aws_sdk_rdsdata::model::Field;

fn map_to_error(field: &Field) -> MappingError {
    MappingError::ConvertFailed(format!("{:?}", field))
}

fn deref<T: Copy>(v: &T) -> T {
    *v
}

pub fn to_string(field: &Field) -> Result<String, MappingError> {
    field
        .as_string_value()
        .map(|x| x.to_string())
        .map_err(map_to_error)
}

pub fn as_i64(field: &Field) -> Result<i64, MappingError> {
    field.as_long_value().map(deref).map_err(map_to_error)
}

pub fn as_f64(field: &Field) -> Result<f64, MappingError> {
    field.as_double_value().map(deref).map_err(map_to_error)
}

pub fn as_boolean(field: &Field) -> Result<bool, MappingError> {
    field.as_boolean_value().map(deref).map_err(map_to_error)
}
