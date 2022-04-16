use serde_json::Value;

pub fn extract_input(value: &Value) -> anyhow::Result<&Value> {
    Ok(value
        .get("input")
        .ok_or(anyhow::anyhow!("input not found"))?)
}

pub fn extract_arg_string(value: &Value, key: &str) -> anyhow::Result<String> {
    Ok(value
        .get(key)
        .ok_or(anyhow::anyhow!("arguments [{}] not found", key))?
        .as_str()
        .unwrap()
        .to_string())
}

pub fn extract_arg_int(value: &Value, key: &str) -> anyhow::Result<i64> {
    Ok(value
        .get(key)
        .ok_or(anyhow::anyhow!("arguments [{}] not found", key))?
        .as_i64()
        .unwrap())
}
