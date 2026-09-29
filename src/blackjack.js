import { Card } from "./card.js"

export class Player { // Also the dealer
    constructor(name, table) {
        this.name = name;
        this.table = table;

        this.deck = [];
        this.balance = 200;
        this.bet = 50;
    }

    Hit() {
        let card = this.table.TakeCard();
        this.deck.push(card);
    }
    GetDeckSum() {
        let sum = 0
        for (const card of this.deck) {
            sum += card.gameValue;
        }
        return sum;
    }
}

export class Table {
    deck = [];

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