use crate::error::MappingError;

pub trait MapTo<T> {
    fn map_to_model(&self) -> Result<T, MappingError>;
}
