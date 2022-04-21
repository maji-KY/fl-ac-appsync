use aws_sdk_rdsdata::client::fluent_builders::ExecuteStatement;
use aws_sdk_rdsdata::model::sql_parameter::Builder;
use aws_sdk_rdsdata::model::Field;
use chrono::{DateTime, Utc};

pub trait BindParam<T> {
    fn bind_param(self, name: &str, value: T) -> Self;
}

impl BindParam<String> for ExecuteStatement {
    fn bind_param(self, name: &str, value: String) -> Self {
        self.parameters(
            Builder::default()
                .name(name)
                .value(Field::StringValue(value))
                .build(),
        )
    }
}

impl BindParam<i64> for ExecuteStatement {
    fn bind_param(self, name: &str, value: i64) -> Self {
        self.parameters(
            Builder::default()
                .name(name)
                .value(Field::LongValue(value))
                .build(),
        )
    }
}

impl BindParam<DateTime<Utc>> for ExecuteStatement {
    fn bind_param(self, name: &str, value: DateTime<Utc>) -> Self {
        let formatted = value.format("%Y-%m-%d %H:%M:%S").to_string();
        self.parameters(
            Builder::default()
                .name(name)
                .value(Field::StringValue(formatted))
                .build(),
        )
    }
}
