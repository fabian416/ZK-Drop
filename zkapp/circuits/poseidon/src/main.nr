use std::hash::poseidon;

fn main(min_lat: Field, max_lat: Field, min_lon: Field, max_lon: Field, expected: pub Field) {
    let h = poseidon::bn254::hash_4([min_lat, max_lat, min_lon, max_lon]);
    assert(h == expected);
}
