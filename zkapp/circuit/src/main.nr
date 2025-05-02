use std::hash::poseidon;
fn main(
    lat: Field,
    lon: Field,
    min_lat: pub Field,
    max_lat: pub Field,
    min_lon: pub Field,
    max_lon: pub Field,
    region_hash: pub Field,
    challenge: pub Field,
    session_hash: pub Field,
) {
    // Cast to unsigned integers
    let lat_i32 = lat as i32;
    let lon_i32 = lon as i32;
    let min_lat_i32 = min_lat as i32;
    let max_lat_i32 = max_lat as i32;
    let min_lon_i32 = min_lon as i32;
    let max_lon_i32 = max_lon as i32;

    // Verify if the cords are inside of the public area
    assert(lat_i32 >= min_lat_i32);
    assert(lat_i32 <= max_lat_i32);
    assert(lon_i32 >= min_lon_i32);
    assert(lon_i32 <= max_lon_i32);

    // Verify region asked
    // If the user changes the region the region_hash doesn't match
    let computed_hash = poseidon::bn254::hash_4([min_lat, max_lat, min_lon, max_lon]);
    assert(computed_hash == region_hash);

    // Verify hash unique session
    let computed_session_hash = poseidon::bn254::hash_2([region_hash, challenge]);
    assert(computed_session_hash == session_hash);
}
