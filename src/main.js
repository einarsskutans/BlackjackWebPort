import { Application, Assets, Sprite, Container, Text } from "pixi.js";
import { Table, Player } from "./blackjack";
import { Card } from "./card"

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
    
    // Text
    await Assets.load({
        src: "/assets/Jacquard12-Regular.ttf",
        family: "PrimaryFont"
    });
    const playerSumText = new Text({ 
        text: "TEST",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        }
    });
    const dealerSumText = new Text({ 
        text: "TEST",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        }
    });
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
        sprite.anchor.set(0.5);
        table.spriteDeck[i].sprite = sprite;
        table.spriteDeck[i].sprite.eventMode = "static";
    }
    const cardBackTexture = await Assets.load("/assets/card53.png");
    cardBackTexture.source.scaleMode = "nearest";
    const cardBackSprite = new Sprite(cardBackTexture);
    cardBackSprite.anchor.set(0.5);

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
            container.removeChild(cardBackSprite);
        }
    })

    let elapsed = 0;
    let sleep = 0;
    let waiting = false;

    const scale = ((app.screen.width / 2560) * 0.7 + (app.screen.height / 1440) * 0.3)*8;
    const spacing = scale*24;
    function drawCards(target) {
        for (let i = 0; i < target.deck.length; i++) {
            const card = target.deck[i];
            container.addChild(card.sprite);
            card.sprite.x = -(target.deck.length - 1) * spacing / 2 + i * spacing;
            card.sprite.y = target === player ? app.screen.height / 4 : -app.screen.height / 4;
            card.sprite.scale.set(scale);
            console.log(card.value);
        }
    }
    function drawDealerBackCard() {
        cardBackSprite.scale.set(scale);
        container.addChild(cardBackSprite);
        cardBackSprite.x = -(dealer.deck.length - 1) * spacing / 2;
        cardBackSprite.y = -app.screen.height / 4;
    }

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
                for (const card of dealer.deck) {
                    container.removeChild(card.sprite);
                }
                container.removeChild(cardBackSprite);

                player.deck = [];
                dealer.deck = [];

                table.GenerateDeck();

                dealer.Hit();
                dealer.Hit();
                player.Hit();
                player.Hit();

                playerSumText.text = player.GetDeckSum() + "\nDeck count: " + table.deck.length;
                dealerSumText.text = dealer.GetDeckSum();

                drawCards(player);
                drawCards(dealer);
                drawDealerBackCard();

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

                drawCards(player);

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
                if (player.GetDeckSum() >= dealer.GetDeckSum() && dealer.GetDeckSum() != 21) {
                    dealer.Hit();
                    dealerSumText.text = dealer.GetDeckSum();
                    sleep = 1000;
                    waiting = true;

                    drawCards(dealer);
                }

                break;
            case 3: // LOSE
                playerSumText.text = "LOSE";
                sleep = 1000;
                waiting = true;

                gamestate = 1;

                break;
            case 4: // WIN
                playerSumText.text = "WIN";
                sleep = 1000;
                waiting = true;

                gamestate = 1;

                break;

            default:
                break;
        }
    })
})();
