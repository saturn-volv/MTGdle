import { evaluate_card, badges } from './evaluation.js'
import { Tween, Easing } from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';
import { get_doc, if_exists, get_timestamp, get_local_data, get_local_username } from '../firebase/util.js';
/**
 * A utility function which just appends all the headers and shorthands a return from the scryfall API.
 */
export async function req_scryfall_api(query) {
    const url = `https://api.scryfall.com/${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('There was an issue with the fetch operation: ', error);
    }
}
export async function req_scryfall_api_img(query) {
    const url = `https://api.scryfall.com/${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.blob()
        const local_url = URL.createObjectURL(data);
        return local_url;
    } catch (error) {
        console.error('There was an issue with the fetch operation: ', error);
    }
}

export function load_images(element, image_uris) {
    element.src = './res/card-back.png'
    var urls = [image_uris.normal, image_uris.large]
    urls.forEach((url, i, arr) => {
        async function v() {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const img = new Image();
                img.onload = () => element.src = url;
                img.onerror = (err) => { throw new Error(err); }
                img.src = url;
            } catch(error) {
                console.log(error)
            }
        }
        v();
    })
}

export function get_local_cards() {
    if (window.localStorage.getItem('result-date') === null) return;
    if (window.localStorage.getItem('result-cards') === null) return;
    if (window.localStorage.getItem('result-badges') === null) return;
    const f_cards = window.localStorage.getItem('result-cards').split(',');
    const f_badges = window.localStorage.getItem('result-badges').split(',').map(v => badges[v]);
    const f_score = f_badges.reduce((t, v) => t + v.score, 0);
    const score_txt = document.getElementById("scoreText");
    score_txt.textContent = String(f_score);
    const badges_div = document.getElementById('badges');
    f_badges.forEach(v => badges_div.appendChild(v.get_element()));
    f_cards.forEach(v => {
        req_scryfall_api_img(`cards/${v}?format=image&version=large`).then(img => {
            const image_div = document.createElement("img");
            image_div.src = img;
            image_div.className = "playing_card"
            image_div.width = 255;
            document.getElementById('openedCards').appendChild(image_div);
        });
    })
}

export async function get_cards(db = null) {
    if (db && await if_exists(db, 'user-results', get_local_username())) {
        get_local_data(db).then(v => {
            document.getElementById('openedCards').replaceChildren()
            document.getElementById('badges').replaceChildren()
            const fixed_data = deserialize_result(v[`result_${get_timestamp()}`]);
            const score_txt = document.getElementById("scoreText");
            score_txt.textContent = String(fixed_data.score);
            const badges_div = document.getElementById('badges');
            for (const [badge_name, badge_idx] of Object.entries(fixed_data.evals)) {
                badges_div.appendChild(badges[badge_idx].get_element());
            }

            window.localStorage.setItem('result-date', get_timestamp())
            window.localStorage.setItem('result-cards', v[`result_${get_timestamp()}`].cards.join(','));
            window.localStorage.setItem('result-badges', v[`result_${get_timestamp()}`].badges.map(String).join(','));
            return v;
        });
        return;
    }
    var cards = []
    var set = ""
    var set_released = new Date("1901-01-01")
    var previous_cards = ""
    for (var i = 0; i < (Math.random() < 0.01 ? 9 : 8); i++) {
        var rarity = i < 4 ? "c" : i < (Math.random() < 0.3 ? 6 : 7) ? "u" : Math.random() <= 0.1 ? "m" : "r";
        if (Math.random() < 0.0001)
            rarity = Math.random() < 0.3 ? "m" : "r"
        if (rarity === "m" && set_released < new Date("2008-10-03"))
            rarity = "r"
        var json = await req_scryfall_api(`cards/random?q=-t:phenomenon+-t:hero+-t:stickers+-t:scheme+-t:plane+-t:card+-is:token+-t:emblem+-t:basic+game:paper+-s:sld+r:${rarity}${set}${previous_cards}`);
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
        img.width = 255;

        document.getElementById("openedCards").appendChild(img);
    }

    var evals = {};
    var previous_cards_eval = [];
    cards.forEach((json) => {
        evaluate_card(evals, json, previous_cards_eval);
        previous_cards_eval.push(json)
    });
    console.log(evals)

    const score_txt = document.getElementById("scoreText");
    var total_score = 0;
    for ( const [badge_name, badge_data] of Object.entries(evals)) {
        total_score += badges[badge_data].score;
    }
    const data = { value: 0 }

    const badges_div = document.getElementById('badges');
    for (const [badge_name, badge_idx] of Object.entries(evals)) {
        badges_div.appendChild(badges[badge_idx].get_element());
    }

    const tween = new Tween(data)
        .to({ value: total_score})
        .easing(Easing.Quadratic.Out)
        .onUpdate(() => {
            score_txt.textContent = String(Math.round(data.value));
        })
        .start();
    
    function animate(time) {
    requestAnimationFrame(animate);
        tween.update(time);
    }
    requestAnimationFrame(animate);

    window.localStorage.setItem('result-date', get_timestamp())
    window.localStorage.setItem('result-cards', cards.join(','));
    window.localStorage.setItem('result-badges', Object.values(evals).map(String).join(','));
    return serialize_result(cards, total_score, evals);
}

export function deserialize_result(data) {
    data.cards.forEach(id => {
        req_scryfall_api_img(`cards/${id}?format=image&version=large`).then(img => {
            const image_div = document.createElement("img");
            image_div.src = img;
            image_div.className = "playing_card"
            image_div.width = 255;
            document.getElementById('openedCards').appendChild(image_div);
        });
    })
    return {
        score: data.score,
        evals: Object.fromEntries(data.badges.map(i => [badges[i].name, i]))
    };
}
export function serialize_result(cards, score, evals) {
    return {
        cards: cards.map(v => v.id),
        score: score,
        badges: Object.values(evals)
    };
}