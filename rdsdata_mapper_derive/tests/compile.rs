use rdsdata_mapper_derive::RdsdataMapper;

#[derive(RdsdataMapper, Debug)]
#[rdsdata_mapper(table_name = "record_table")]
pub struct Record {
    string_value: String,
    #[rdsdata_mapper(column_name = "maybe_string")]
    nullable_string_value: Option<String>,
    float_value: f64,
    long_value: i64,
    bool_value: bool,
}

fn main() {
    assert_eq!(Record::select("where string_value = :string_value"), "select string_value,maybe_string,float_value,long_value,bool_value from record_table where string_value = :string_value");
}
