#[test]
fn compile() {
    let t = trybuild::TestCases::new();
    t.pass("tests/compile.rs");
}
