import { Position, Type, fragments } from "./fragments.js";


export function findFragments({
    type = null,
    position = null,
    rude = null,
}) {
    return fragments.filter(fragment => {
        if (type !== null) {
            if (fragment.type !== Type.ANY && fragment.type !== type) {
                return false;
            }
        }
        if (position !== null) {
            if (fragment.position !== Position.ANY && fragment.position !== Position.ALONE && fragment.position !== position) {
                return false;
            }
        }
        if (rude !== null && rude !== fragment.rude) {
            return false;
        }
        return true;
    })
}


export function chooseFragment({
   type = null,
   position = null,
   rude = null,
}) {
    let choices = findFragments({type, position, rude});
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}


const needsHyphen = [
    "a", "e", "i", "o", "u", "s"
]

const duoNeedsHyphen = [
    "ss",
    "yd",
    "ff",
    "gr",
    "gg",
    "ng",
    "ry",
]


const needsCaps = [
    " ", ".", "-", "!", ",", "*"
]


export function titleCase(text) {
    if (!text || text.length === 0) {
        return "";
    }
    let array = text.split("");
    array[0] = array[0].toUpperCase();
    for (let i = array.length - 1; i >= 0; i--) {
        if (needsCaps.includes(array[i])) {
            if (i == array.length - 1) {
                continue;
            }
            array[i + 1] = array[i + 1].toUpperCase();
        }
    }
    return array.join("");
}


export class Word {
    constructor(type = Type.ANY, rude = null) {
        this.type = type
        this.rude = rude
        this.text = this.generate();
    };

    generate() {
        let start = chooseFragment({type: this.type, position: Position.START, rude: this.rude});
        if (start.position === Position.ALONE) {
            return titleCase(start.fragment);
        }
        let end = chooseFragment({type: this.type, position: Position.END, rude: this.rude});
        if (end.position === Position.ALONE) {
            return titleCase(end.fragment);
        }
        let word = [start.fragment, end.fragment]
        let endChar = "";
        let startChar = "";
        if (start.fragment.length > 0) {
            endChar = start.fragment[start.fragment.length - 1].toLowerCase();
        }
        if (end.fragment.length > 0) {
            startChar = end.fragment[0].toLowerCase();
        }
        if (
            (
                (start.hyphenate || end.hyphenate)
                || (startChar === endChar)
                || needsHyphen.includes(startChar)
                || needsHyphen.includes(endChar)
                || duoNeedsHyphen.includes(endChar + startChar)
            )
            && (
                endChar !== " "
                && startChar !== " "
            )
        ) {
            word = [titleCase(start.fragment), "-", titleCase(end.fragment)]
        }
        let text = word.join("");
        return titleCase(text);
    }
}


export class Cumberbatcher {
    constructor(rude = null) {
        this.rude = rude;
        this.forename = null;
        this.surname = null;
        this.name = null;
    }

    generate() {
        this.forename = new Word(Type.FORENAME, this.rude);
        this.surname = new Word(Type.SURNAME, this.rude);
        this.name = [this.forename.text, this.surname.text].join(" ");
    }
}
