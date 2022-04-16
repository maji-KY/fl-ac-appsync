use serde::Deserialize;
use serde_json::Value;
use std::future::Future;
use tracing::{info_span, Instrument};

#[derive(Debug, Deserialize)]
pub struct User {
    #[serde(rename = "sub")]
    pub id: String,
    #[serde(rename = "https://example.com/email")]
    pub email: String,
    #[serde(rename = "https://example.com/nickname")]
    pub nickname: String,
}

#[derive(thiserror::Error, Debug)]
pub enum AuthError {
    #[error("identity not found")]
    IdentityNotFound,
    #[error("claims not found")]
    ClaimsNotFound,
}

pub fn get_auth_user(payload: &Value) -> anyhow::Result<User> {
    let claims = payload
        .get("identity")
        .ok_or(AuthError::IdentityNotFound)?
        .get("claims")
        .ok_or(AuthError::ClaimsNotFound)?;
    let user = User::deserialize(claims)?;
    Ok(user)
}

pub async fn with_auth<T, R>(payload: Value, f: impl Fn(User, Value) -> R) -> anyhow::Result<T>
where
    R: Future<Output = anyhow::Result<T>>,
{
    let user = get_auth_user(&payload)?;
    let span = info_span!(
        "access_user",
        id = user.id.as_str(),
        email = user.email.as_str()
    );
    let arguments = payload.get("arguments").unwrap().clone();
    f(user, arguments).instrument(span).await
}
