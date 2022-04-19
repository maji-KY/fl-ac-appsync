#[derive(thiserror::Error, Debug)]
pub enum MappingError {
    #[error("value convert failed: {0}")]
    ConvertFailed(String),
}
