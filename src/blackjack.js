import { Card } from "./card.js"

export class Player { // Also the dealer
    constructor(name, table) {
        this.name = name;
        this.table = table;

        this.deck = [];
        this.balance = 0;
        this.bet;
        this.balanceDefault = 35000;
        this.betDefault = 50;
        this.inventory = {};
        this.hp = 3;
        this.endgame = 0;
        this.Reset();
    }

    Hit() {
        let card = this.table.TakeCard();
        this.deck.push(card);
        console.log("Deck length: " + this.table.deck.length)
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
        this.hp = 3;
        this.endgame = 0;
        this.inventory = {
            profit: 0,
            backcard3: 0,
            kill: 0,
            profitGold: 0,
        };
    }
    SaveData() {
        localStorage.setItem(`${this.name}.save`, 1);
        localStorage.setItem(`${this.name}.balance`, this.balance);
        localStorage.setItem(`${this.name}.profit`, this.inventory.profit);
        localStorage.setItem(`${this.name}.profitGold`, this.inventory.profitGold);
        localStorage.setItem(`${this.name}.backcard3`, this.inventory.backcard3);
        localStorage.setItem(`${this.name}.kill`, this.inventory.kill);
        localStorage.setItem(`${this.name}.endgame`, this.endgame);
        localStorage.setItem(`${this.name}.hp`, this.hp);
    }
    LoadData() {
        if (parseInt(localStorage.getItem(`${this.name}.save`)) == 1) {
            console.log("Save exists");
            this.balance = parseInt(localStorage.getItem(`${this.name}.balance`));
            this.inventory.profit = parseInt(localStorage.getItem(`${this.name}.profit`));
            this.inventory.profitGold = parseInt(localStorage.getItem(`${this.name}.profitGold`));
            this.inventory.backcard3 = parseInt(localStorage.getItem(`${this.name}.backcard3`));
            this.inventory.kill = parseInt(localStorage.getItem(`${this.name}.kill`));
            this.endgame = parseInt(localStorage.getItem(`${this.name}.endgame`));
            this.hp = parseInt(localStorage.getItem(`${this.name}.hp`));
        }
        else console.log("Save not found");
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