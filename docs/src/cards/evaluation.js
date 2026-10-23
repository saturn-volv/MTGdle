const badge_rating = [
    ["common", "#cccccc"],
    ["uncommon", "#6a9a81"],
    ["rare", "#dfc94c"],
    ["mythic", "#c6381b"],
    // ["top", "#cccccc"],
];

class CardEvaluation {
    score;
    name;
    description;
    icon;
    rank;
    constructor(score, name, description, icon, rank) {
        this.score = score;
        this.name = name;
        this.description = description
        this.icon = icon
        this.rank = rank;
    };

    get_element() {
        const div = document.createElement('div');
        div.className = 'badge';
        div.id = 'badge'

        const title_line = document.createElement('div');
        const title_name = document.createElement('span');
        title_name.textContent = `${this.icon} ${this.name.toUpperCase()}`;
        const title_rank = document.createElement('span');
        title_rank.textContent = badge_rating[this.rank][0];
        const rank_color = badge_rating[this.rank][1]
        title_rank.style.color = rank_color;
        title_rank.style.backgroundColor = `${rank_color}1C`;
        title_rank.style.borderColor = rank_color;
        title_rank.style.borderWidth = '0.1rem';
        title_rank.style.borderStyle = 'solid';
        title_rank.style.borderRadius = '0.2rem';
        title_rank.style.padding = '0.1rem 0.3rem';

        const score_div = document.createElement('span');
        score_div.textContent = `+${this.score}`;
        score_div.style.marginLeft = 'auto';

        title_name.appendChild(title_rank);
        title_line.appendChild(title_name);
        title_line.appendChild(score_div);
        title_line.className = 'badge_title';

        div.appendChild(title_line);

        const description_div = document.createElement('span');
        description_div.textContent = this.description;
        description_div.className = 'badge_description'
        div.appendChild(description_div);

        return div;
    }
}
export const badges = [
    new CardEvaluation(30000000, "Black Lotus", "The most powerful card in *all* of magic.", "", 3), // 0
    new CardEvaluation(100, "Common", "Pauper playable!", "⚪", 0), // 1
    new CardEvaluation(300, "Uncommon", "Now those are some limited staples", "🔘", 1), // 2
    new CardEvaluation(500, "Rare", "Boush", "🟡", 2), // 3
    new CardEvaluation(1000, "Mythic", "Bomb hit incoming!", "🟠", 3), // 4
    new CardEvaluation(150, "Penny", "Worth less than one whole US Dollar!", "🪙", 0), // 5
    new CardEvaluation(700, "Masters Set", "High reprint value!", "🌟", 2),
    new CardEvaluation(10000000, "Power Nine!", "One of the nine most powerful cards in magic!", "🌟", 3),
    new CardEvaluation(500, "Vanilla", "A card has no text on it.", "🍦", 2),
    new CardEvaluation(1000, "Banned!", "A card was banned in a format. Must be good!", "🚫", 1),
    new CardEvaluation(10000, "Wooberg", "A card is all 5 colors!", "🌈", 1), // 10
    new CardEvaluation(5000, "Glint-Eye", "A card is Blue, Black, Red and Green.", "👁️", 2),
    new CardEvaluation(5000, "Dune-Brood", "A card is Black, Red, Green and White.", "🏜️", 2),
    new CardEvaluation(5000, "Ink-Treader", "A card is Red, Green, White and Blue.", "✒️", 2),
    new CardEvaluation(5000, "Witch-Maw", "A card is Green, White, Blue and Black.", "🧙‍♀️", 2),
    new CardEvaluation(5000, "Yore-Tiller", "A card is White, Blue, Black and Red.", "🕰️", 2), // 15
    new CardEvaluation(3500, "Abzan", "I miss when Siege Rhino was a good card.", "🦏", 1),
    new CardEvaluation(3500, "Bant", "", "🏰", 1),
    new CardEvaluation(3500, "Esper", " ", "🔩", 1),
    new CardEvaluation(3500, "Grixis", " ", "🪦", 1),
    new CardEvaluation(3500, "Jeskai", " ", "🧘‍♀️", 1), // 20
    new CardEvaluation(3500, "Jund", " ", "🌋", 1),
    new CardEvaluation(3500, "Mardu", " ", "⚔️", 1),
    new CardEvaluation(3500, "Naya", " ", "🏞️", 1),
    new CardEvaluation(3500, "Sultai", " ", "🐍", 1),
    new CardEvaluation(3500, "Temur", " ", "🗻", 1), // 25
    new CardEvaluation(2000, "Azorius", " ", "⚖️", 0),
    new CardEvaluation(2000, "Boros", " ", "🛡️", 0),
    new CardEvaluation(2000, "Dimir", " ", "🌃", 0),
    new CardEvaluation(2000, "Golgari", " ", "🧟", 0),
    new CardEvaluation(2000, "Gruul", " ", "🧌", 0), // 30
    new CardEvaluation(2000, "Izzet", " ", "⚡️", 0),
    new CardEvaluation(2000, "Orzhov", " ", "🌕", 0),
    new CardEvaluation(2000, "Rakdos", " ", "⛓️", 0),
    new CardEvaluation(2000, "Selesnya", " ", "🌿", 0),
    new CardEvaluation(2000, "Simic", " ", "🫟", 0), // 35
    new CardEvaluation(2000, "Fatehold", " ", "🔮", 0),
    new CardEvaluation(2000, "Lorehold", " ", "📜", 0),
    new CardEvaluation(2000, "Theorix", " ", "⌛", 0),
    new CardEvaluation(2000, "Witherbloom", " ", "💀", 0),
    new CardEvaluation(2000, "Konstari", " ", "🪵", 0), // 40
    new CardEvaluation(2000, "Prismari", " ", "🎨", 0),
    new CardEvaluation(2000, "Silverquill", " ", "🖊️", 0),
    new CardEvaluation(2000, "Stingerquill", " ", "🗣️", 0),
    new CardEvaluation(2000, "Vigorbloom", " ", "🪴", 0),
    new CardEvaluation(2000, "Quandrix", " ", "🔣", 0), // 45
    new CardEvaluation(1500, "Phyrexian Praetor", "Oil Slicked and ready for domination...", "Φ", 2),
    new CardEvaluation(500, "Bulk Mythic", "bummer...", "😔", 1),
    new CardEvaluation(25000, "Insane Hit!!", "Nice pulls!!", "🔥", 1),
    new CardEvaluation(10000, "Great Hit!", "An absolute heater!", "💣", 2),
    new CardEvaluation(5000, "Nice Pull", "Going straight into the trade binder", "👌", 2), // 50
    new CardEvaluation(100000, "God Pack!!", "The total cost of the pack was higher than $65!!", "💸", 2),
    new CardEvaluation(100000, "Hard to find!", "This card doesn't have any current listings on TCGPlayer", "🫥", 2),
]

/**
 * 
 * @param {JSON} card_json 
 * @param {Function} evaluation_func 
 * @returns {CardEvaluation}
 */
const evaluations = [
    (card_json) => { // Rarity ⚪🔘🟡🟠
        if (card_json.rarity == "common")
            return 1;
        if (card_json.rarity == "uncommon")
            return 2;
        if (card_json.rarity == "rare")
            return 3;
        if (card_json.rarity == "mythic")
            return 4;
        return false; // How the fuck.
    },
    (card_json) => { // Penny (Worth less than USD$1.)
        if (card_json.prices.usd && card_json.prices.usd < 1.)
            return 5;
        return false;
    },
    (card_json) => { // Masters Set
        const master_sets = ["cmm", "2x2", "rvr", "inr", "dmr", "tsr", "2xm", "uma", "ema", "ima", "a25", "mm2", "mm3", "mma", "chr"];
        if (master_sets.includes(card_json.set))
            return 6;
        return false;
    },
    (card_json) => { // Power Nine
        const power_nine = ["Ancestral Recall", "Time Walk", "Timetwister", "Mox Pearl", "Mox Sapphire", "Mox Jet", "Mox Ruby", "Mox Emerald", "Black Lotus"];
        if (card_json.card_faces)
            return false;
        if (power_nine.includes(card_json.name))
            return 7;
        return false;
    },
    (card_json) => { // Black Lotus
        if (card_json.card_faces)
            return false;
        if (card_json.name == "Black Lotus")
            return 0;
    },
    (card_json) => { // Vanilla
        if (card_json.card_faces)
            return false;
        if (card_json.oracle_text.length == 0)
            return 8;
    },
    (card_json) => { // Banned
        // console.log(card_json.legalities);
        for (const [format, legality] of Object.entries(card_json.legalities)) {
            if (legality == "banned")
                return 9
        }
        return false;
    },
    (card_json) => {
        if (card_json.color_identity.length >= 5)
            return 10;
        if (card_json.color_identity.length == 4) {     // 👁️🏜️✒️🧙‍♀️🕰️
            if (!card_json.color_identity.includes("G"))
                return 11;
            if (!card_json.color_identity.includes("U"))
                return 12;
            if (!card_json.color_identity.includes("B"))
                return 13;
            if (!card_json.color_identity.includes("R"))
                return 14;
            if (!card_json.color_identity.includes("G"))
                return 15;
            }
        const includesAll = (arr, values) => values.every(v => arr.includes(v));
        if (card_json.color_identity.length == 3) { // 3-color :)))))
            const three_color_types = [
                ["W","B","G"],
                ["G","W","U"],
                ["W","U","B"],
                ["U","B","R"],
                ["U","R","W"],
                ["B","R","G"],
                ["R","W","B"],
                ["R","G","W"],
                ["B","G","U"],
                ["G","U","R"]
            ];
            three_color_types.forEach((v, i) => {
                if (includesAll(card_json.color_identity, v));
                    return 16 + i;

            });
        }
        if (card_json.color_identity.length == 2) {
            const two_color_types = [
                ["W", "U"],
                ["R", "W"],
                ["B", "U"],
                ["B", "G"],
                ["R", "G"],
                ["U", "R"],
                ["W", "B"],
                ["B", "R"],
                ["G", "W"],
                ["G", "U"],
            ];
            two_color_types.forEach((v, i) => {
                if (includesAll(card_json.color_identity, v));
                    var offset;
                    if (card_json.set == "sos" || card_json.set == "stx" || card_json.set == "fra") {
                        if ((i == 1 || i == 3 || i == 5 || i == 6 || i == 9) || card_json.set == "fra" && (i == 0 || i == 2 || i == 4 || i== 7 || i == 8))
                            offset += 10;
                    }
                    return 26 + i + offset;

            });
        }
    },
    (card_json) => {
        if (card_json.type_line.includes("Praetor"))
            return 46;
    },
    (card_json) => {
        if (card_json.prices.usd === null)
            return 52;
        if (card_json.prices.usd <= 2. && card_json.rarity == "mythic")
            return 47;
        if (card_json.prices.usd >= 100)
            return 48;
        if (card_json.prices.usd >= 25)
            return 49;
        if (card_json.prices.usd >= 5)
            return 50;
    },
    (card_json, previous_cards) => {
        var total_value = 0.
        previous_cards.forEach((json) => {
            total_value += json.prices.usd;
        });
        if (card_json.prices.usd + total_value >= 65)
            return 51;
    }
];

export function evaluate_card(evals, card_json, previous_cards) {
    evaluations.forEach(f => {
        var e = f(card_json, previous_cards)
        if (e && !(badges[e].name.toLowerCase() in evals))
            evals[badges[e].name] = e;
    });
}