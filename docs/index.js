/*
    
    CARD SCORING BADGES

    - Rarity (Common: 100, Uncommon 300, Rare: 500, Mythic: 1500.)
    - Penny (Worth less than $1.) : 150
    - Masters Set (Modern Masters, Commander Masters, Double Masters) : 5,000.
    - Power 9: 10, 000, 000.
    - Big Butt: Toughness is at least 4 more than it's power: 300.
    - Vanilla: 500


    RESULT DOCUMENT FORMAT:

    id: result_dd_mm_yy
        - cards: Array[String]
        - score: 1680
        - badges: Array[UInt8]


    
 */
import { deserialize_result, get_cards, get_local_cards } from "./src/cards/scryfall.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore, collection, query, where, doc, getDocs } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js"
import { get_preimage_hash } from "./src/crypto/hash.js";
import { env } from "./keys.env.js";
import { get_doc_else, get_timestamp, set_doc_merge, get_local_username, get_local_data_then, get_doc, get_local_data, set_doc, if_exists } from "./src/firebase/util.js";


const firebaseConfig = {
    apiKey: env.API_KEY,
    authDomain: env.AUTH_DOMAIN,
    projectId: env.PROJECT_ID,
    storageBucket: env.STORAGE_BUCKET,
    messagingSenderId: env.MESSAGING_SENDER_ID,
    appId: env.APP_ID
}
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

var user = null;
var todays_result = null;

if (!window.localStorage.getItem('user-hash') && isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('email_for_sign_in');
    if (!email) {
        email = window.prompt('Please provide your email for confirmation.');
    }
    const url_params = new URLSearchParams(window.location.search);

    signInWithEmailLink(auth, email, window.location.href).then(v => {
        if (url_params.has('hash'))
            window.localStorage.setItem('user-hash', url_params.get('hash'));
        window.location.assign('/');
    }).catch(error => {
        console.error(error.message);
    });
}

if (window.localStorage.getItem('user-hash')) {
    document.getElementById('sign_in_reminder').remove();
    
    if (window.localStorage.getItem('result-date') != null) {
        if (window.localStorage.getItem('result-date') != get_timestamp()) {
            window.localStorage.removeItem('result-date');
            window.localStorage.removeItem('result-cards');
            window.localStorage.removeItem('result-badges');
        } else {
            document.getElementById("openedPack").style.display = "flex";
            document.getElementById("hideOnOpen").style.display = "none";
            get_local_cards()
        }
    }
    if (window.localStorage.getItem('user-name')) {
        const username = window.localStorage.getItem('user-name');
        const profile_button = document.getElementById('sign_in_header_button');
        profile_button.href = `/user?q=${username}`;
        profile_button.textContent = username;
    } else {
        const user_data = get_doc_else(db, "user-results", `user:${window.localStorage.getItem('user-hash')}`, {
            username: `${(window.localStorage.getItem('email_for_sign_in') ?? "undefined").split('@')[0]}`
        }).then(v => {
            const profile_button = document.getElementById('sign_in_header_button');
            profile_button.href = `/user?q=${v.username}`;
            window.localStorage.setItem('user-name', v.username);
            profile_button.textContent = v.username;
            if (document.getElementById('sign_in_icon'))
                document.getElementById('sign_in_icon').remove();
            user = v;
            console.log(user);
        });
        window.localStorage.removeItem('email_for_sign_in');
    }
    query_for_today();
    /*const q = query(user_results, where("Document ID", "==", `user:${window.localStorage.getItem('user-hash')}`));
    const q_snapshot = await getDocs(q)
    q_snapshot.forEach(v => {
        const doc_data = v.data();
        user = {
            username: doc_data.username
        }
    })*/
}

const signin_buttons = document.querySelectorAll('.sign_in_button');
function sign_in_button_clicked(event) {
    if (user) return;
    event.preventDefault();
    console.log('Signing in!');
    const user_email = prompt('Please enter your email. A magic link will be sent to your email to log in.', "your-email-here@domain.com");
    get_preimage_hash(user_email).then(hash => {
        const url = "localhost:5500";
        const action_code_settings = {
            url: `http://${url}?hash=${hash}`,
            handleCodeInApp: true,
            linkDomnain: `mtgdle.volv.dev`
        };
        // const auth = getAuth(firebaseApp);
        sendSignInLinkToEmail(auth, user_email, action_code_settings)
        .then(() => {
            window.localStorage.setItem('email_for_sign_in', user_email);
        })
        .catch((error) => {
            const error_code = error.code;
            const error_message = error.message;

            console.error(error_code, ": ", error_message);
        });
    });
}
signin_buttons.forEach(v => {
    v.addEventListener('click', sign_in_button_clicked);
})
const open_pack_button = document.getElementById("openMagicPack");

function query_for_today() {
    get_local_data(db).then((v) => {
        window.localStorage.setItem('local_db_answer', JSON.stringify(v.data()));
        if (v[`result_${get_timestamp()}`]){
            get_cards(db).then(c => todays_result = c);
            document.getElementById("openedPack").style.display = "flex";
            document.getElementById("hideOnOpen").style.display = "none";
        }
    });
    
}
open_pack_button.addEventListener("click", () => {
    if (todays_result) return;
    get_cards().then(v => {
        let data = {}
        data[`result_${get_timestamp()}`] = v;
        set_doc_merge(db, 'user-results', get_local_username(), data);
        
        window.localStorage.setItem('result-date', get_timestamp())
        window.localStorage.setItem('result-cards', v.cards.join(','));
        window.localStorage.setItem('result-badges', v.badges.map(String).join(','));
    });
    document.getElementById("openedPack").style.display = "flex";
    document.getElementById("hideOnOpen").style.display = "none";
}, {once: true})


/**
var set = ""
var set_released = new Date("1901-01-01")
var previous_cards = ""
for (var i = 0; i < 8; i++) {
    var rarity = i < 4 ? "c" : i < (Math.random() < 0.3 ? 6 : 7) ? "u" : Math.random() <= 0.1 ? "m" : "r";
    if (Math.random() < 0.0001)
        rarity = Math.random() < 0.3 ? "m" : "r"
    if (rarity === "m" && set_released < new Date("2008-10-03"))
        rarity = "r"
    var json = await req_scryfall_api(`cards/random?q=-t:hero+-t:stickers+-t:scheme+-t:plane+-t:card+-is:token+-t:emblem+-t:basic+game:paper+-s:sld+r:${rarity}${set}${previous_cards}`);
    cards.push(json)
    console.log(json)
    if (set === "")
        set = `+s:${json.set}`
    set_released = new Date(json.released_at)
    previous_cards += `+-!\"${json.name}\"`
    const img = document.createElement("img");
    var uris = json.image_uris
    if (json.card_faces && json.card_faces[0].image_uris) {
        uris = json.card_faces[0].image_uris
        console.log(json.card_faces)
    }
    load_images(img, uris)
    // img.src = json.image_uris.small;
    img.className = "playing_card"
    img.width = 255

    document.body.getElementsByClassName("pack_opened")[0].appendChild(img);
}

var evals = {};
var previous_cards_eval = [];
cards.forEach((json) => {
    evaluate_card(evals, json, previous_cards_eval);
    previous_cards_eval.push(json)
});
console.log(evals);
 */