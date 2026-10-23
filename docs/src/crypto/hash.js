export async function get_preimage_hash(msg) {
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);

    const hash_buffer = await crypto.subtle.digest('SHA-256', data);

    const hash_array = Array.from(new Uint8Array(hash_buffer));
    const hash_hex = hash_array.map(b => b.toString(16).padStart(2, '0')).join('');

    return hash_hex;
}