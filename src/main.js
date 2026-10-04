import { Application, Assets, Sprite, Container, Text } from "pixi.js";
import { Table, Player } from "./blackjack";

(async () => {
     // Create a new application
     const app = new Application();

     // Initialize the application
    await app.init({ background: "#00563F", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container").appendChild(app.canvas);

    // Render setup
    const container = new Container();
    app.stage.addChild(container);
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Defining layouts
    let leftSide = -app.screen.width / 2;
    let bottomSide = app.screen.height / 2;
    
    // Text
    await Assets.load({
        src: "/assets/Jacquard12-Regular.ttf",
        family: "PrimaryFont"
    })
    const playerSumText = new Text({ 
        text: "TEST",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        }
    })
    const dealerSumText = new Text({ 
        text: "TEST",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        }
    })
    container.addChild(playerSumText);
    container.addChild(dealerSumText);
    playerSumText.x = -app.screen.width / 2 + 32;
    playerSumText.y = -app.screen.height / 2 + 32;
    dealerSumText.x = -app.screen.width / 2 + 128;
    dealerSumText.y = -app.screen.height / 2 + 32;

    // Game logic
    let gamestate = 1;

    const table = new Table();
    table.GenerateSpriteDeck();
    for (let i = 0; i < 52; i++) {
        const texture = await Assets.load(`/assets/card${i+1}.png`);
        texture.source.scaleMode = "nearest";
        const sprite = new Sprite(texture);
        table.spriteDeck[i].sprite = sprite;
        table.spriteDeck[i].sprite.eventMode = "static";
        table.spriteDeck[i].sprite.on("pointerover", () => {
            table.spriteDeck[i].sprite.scale.set(5);
            table.spriteDeck[i].sprite.x -= 16;
            table.spriteDeck[i].sprite.y -= 32;
        })
        table.spriteDeck[i].sprite.on("pointerout", () => {
            table.spriteDeck[i].sprite.scale.set(4);
            table.spriteDeck[i].sprite.x += 16;
            table.spriteDeck[i].sprite.y += 32;
        })
    }

    let player = new Player("Player", table);
    let dealer = new Player("Dealer", table);

    document.addEventListener("keydown", (event) => {
        if (event.key ==  "x") {
            gamestate = 2;
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key ==  "z") {
            gamestate = 6;
        }
    })

    /*
    let f = 3;
    container.addChild(table.deck[f].sprite);
    table.deck[f].sprite.x = 400;
    table.deck[f].sprite.scale = 4;
    playerSumText.text = table.deck[f].value;
    console.log(table.deck[f].value)
    */

    let elapsed = 0;
    let sleep = 0;
    let waiting = false;

    app.ticker.add((ticker) => {
        
        // Sleep functionality
        if (waiting) {
            elapsed += ticker.deltaMS;
            if (elapsed >= sleep) {
                waiting = false;
                elapsed = 0;
                sleep = 0;
                console.log('Finished waiting in ticker!');
            }
            return;
        }

        // Main gameplay loop
        switch (gamestate) {
            case 1: // START, take 2 cards
                for (const card of player.deck) {
                    container.removeChild(card.sprite);
                }

                player.deck = [];
                dealer.deck = [];

                table.GenerateDeck();

                dealer.Hit();
                dealer.Hit();
                player.Hit();
                player.Hit();

                playerSumText.text = player.GetDeckSum() + "\nDeck count: " + table.deck.length;
                dealerSumText.text = dealer.GetDeckSum();

                for (let i = 0; i < player.deck.length; i++) {
                    const card = player.deck[i];

                    container.addChild(card.sprite);
                    card.sprite.scale.set(4);
                    card.sprite.x = leftSide + 32 + i*128;
                    card.sprite.y = bottomSide - 128 - 64;
                    
                    console.log(card.value);
                }

                if (player.GetDeckSum() > 21 || dealer.GetDeckSum() === 21) {
                    gamestate = 3;
                    break;
                }
                if (player.GetDeckSum() === 21 || dealer.GetDeckSum() > 21) {
                    gamestate = 4;
                    break;
                }

                gamestate = 5;

                break;
        
            case 2: // HIT, take 1 card
                player.Hit();

                playerSumText.text = player.GetDeckSum() + "\nDeck count: " + table.deck.length;

                //if (player.GetDeckSum() > 21) gamestate = 3;

                for (let i = 0; i < player.deck.length; i++) {
                    const card = player.deck[i];

                    container.addChild(card.sprite);
                    card.sprite.scale.set(4);
                    card.sprite.x = leftSide + 32 + i*128;
                    card.sprite.y = bottomSide - 128 - 64;
                    
                    console.log(card.value);
                }

                if (player.GetDeckSum() > 21 && dealer.GetDeckSum() > 21) {
                    gamestate = 4; // Change this to a TIE
                    break;
                }
                if (player.GetDeckSum() > 21 || dealer.GetDeckSum() === 21) {
                    gamestate = 3;
                    break;
                }
                if (player.GetDeckSum() === 21 || dealer.GetDeckSum() > 21) {
                    gamestate = 4;
                    break;
                }

                gamestate = 5;

                break;
            case 6: // HOLD
                if (player.GetDeckSum() < dealer.GetDeckSum() && dealer.GetDeckSum() < 22) {
                    gamestate = 3;
                    break;
                }
                if (dealer.GetDeckSum() === 21 && player.GetDeckSum() === 21) {
                    gamestate = 4; // Change this to a TIE
                    break;
                }
                if (dealer.GetDeckSum() > 21) {
                    gamestate = 4;
                    break;
                }
                if (player.GetDeckSum() > dealer.GetDeckSum() && dealer.GetDeckSum() != 21) {
                    dealer.Hit();
                    dealerSumText.text = dealer.GetDeckSum();
                    sleep = 1000;
                    waiting = true;
                }

                break;
            case 3: // LOSE
                playerSumText.text = "LOSE";
                sleep = 3000;
                waiting = true;

                gamestate = 1;

                break;
            case 4: // WIN
                playerSumText.text = "WIN";
                sleep = 3000;
                waiting = true;

                gamestate = 1;

                break;

            default:
                break;
        }
    })
})();
