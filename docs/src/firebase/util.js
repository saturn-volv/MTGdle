
import { getFirestore, collection, query, where, doc, setDoc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

export function get_local_username() {
    return `user:${window.localStorage.getItem('user-hash')}`;
}
export function get_local_data(db) {
    return get_doc(db, 'user-results', get_local_username());
}
export function get_local_data_then(db, callback) {
    get_doc(db, 'user-results', get_local_username()).then(callback);
}

export function get_doc(db, collection_name, doc_id) {
    if (!if_exists(db, collection_name, doc_id)) throw new Error("Attempted to get data that does not exist.");
    const doc_ref = doc(db, collection_name, doc_id);
    return getDoc(doc_ref);
}
export async function set_doc(db, collection_name, doc_id, data) {
    const doc_ref = doc(db, collection_name, doc_id);
    try {
        await runTransaction(db, async (trans) => {
            trans.set(doc_ref, data);
            out = data;
            return;
        })
    } catch(error) {
        console.error(error.message);
    }
}
export async function set_doc_merge(db, collection_name, doc_id, data) {
    const doc_ref = doc(db, collection_name, doc_id);
    return await setDoc(doc_ref, data, {merge: true});
}

export async function get_doc_else(db, collection_name, doc_id, data) {
    const doc_ref = doc(db, collection_name, doc_id);
    let out = null;
    try {
        await runTransaction(db, async (trans) => {
            const doc_snap = await trans.get(doc_ref);

            if (doc_snap.exists()) {
                console.log('already exists :/');
                out = doc_snap.data(); // Document already exists.
                return;
            }

            trans.set(doc_ref, data);
            console.log("Successfully created data");
            out = data;
            return;
        })
    } catch(error) {
        console.error(error.message);
    }
    return out;
}

export async function if_exists(db, collection_name, doc_id) {
    const doc_ref = doc(db, collection_name, doc_id);
    let out = null;
    try {
        await runTransaction(db, async (trans) => {
            const doc_snap = await trans.get(doc_ref);
            if (doc_snap.exists()) {
                out = true; // Document already exists.
                return;
            }
            out = false;
            return;
        })
    } catch(error) {
        console.error(error.message);
    }
    return out;
}

export function get_timestamp(date = new Date()) {
    const DD = String(date.getUTCDate()).padStart(2, '0');
    const MM = String(date.getUTCMonth()+1).padStart(2, '0');
    const YY = String(date.getUTCFullYear()).slice(2);
    return `${DD}_${MM}_${YY}`;
}