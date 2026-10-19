import { Card } from "./card.js"

export class Player { // Also the dealer
    constructor(name, table) {
        this.name = name;
        this.table = table;

        this.deck = [];
        this.balance;
        this.bet;
        this.balanceDefault = 2000;
        this.betDefault = 50;
        this.inventory = {};
        this.Reset();
    }

    Hit() {
        let card = this.table.TakeCard();
        this.deck.push(card);
    }
    GetDeckSum() {
        let sum = 0
        if (this.deck.length > 0) {
            for (const card of this.deck) {
                sum += card.gameValue;
            }
        }
        return sum;
    }
    Reset() {
        this.balance = this.balanceDefault;
        this.bet = this.betDefault;
        this.inventory = {
            profit: 0,
            backcard3: 0,
            kill: 0
        };
    }
}

export class Table {
    deck = [];
    spriteDeck = [];
    inventory = [];

    GenerateSpriteDeck() {
        this.spriteDeck = [];
        for (let symbol = 1; symbol < 5; symbol++) {
            for (let value = 1; value < 14; value++) {
                let card = new Card(value, value, symbol);
                //if (value == 1) card.gameValue = 11; // Ace is 11
                if (value >= 10) card.gameValue = 10;
                card.symbol = symbol;
                this.spriteDeck.push(card);
            }
        }
    }

    GenerateDeck() {
        this.deck = [];
        for (const card of this.spriteDeck) {
            this.deck.push(card);
        }
        
    }
    TakeCard() {
        const n = Math.floor(Math.random() * this.deck.length);
        const card = this.deck[n]; // Get a returnable before erasing
        this.deck.splice(n, 1);
        return card;
    }
}