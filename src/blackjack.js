import { Card } from "./card.js"

export class Player {
    constructor(name) {
        this.name = name;
    }

    // After house
}

export class Table {
    constructor() {
        this.deck = [];
    }

    GenerateDeck() {
        this.deck = [];
        for (let value = 1; value < 14; value++) {
            for (let symbol = 1; symbol < 5; symbol++) {
                const card = new Card(value, value, symbol);
                if (value > 10) card.gameValue = 10; // Faces are 10
                if (value == 1) card.gameValue = 11; // Ace is 11
                card.symbol = symbol;
                this.deck.push(card);
            }
        }
    }
    TakeCard() {
        const n = Math.floor(Math.random() * this.deck.length);
        const card = this.deck[n]; // Get a returnable before erasing
        this.deck.splice(n, 1);
        return card;
    }
}