fn main(a: Field, b: pub Field) -> pub Field {
    let a_i32 = a as i32;
    let b_i32 = b as i32;

    let result = if a_i32 > b_i32 { 1 } else { 0 };
    result as Field
}
