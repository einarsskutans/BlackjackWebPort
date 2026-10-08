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
    
    // Text
    const font = new FontFace(
        "PrimaryFont",
        "url('/assets/Silkscreen-Regular.ttf')"
    );
    await font.load();
    document.fonts.add(font);

    const playerSumText = new Text({ 
        text: "TEST",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5
    });
    const dealerSumText = new Text({ 
        text: "TEST",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5
    });
    container.addChild(playerSumText);
    container.addChild(dealerSumText);

    // Game logic

    let gamestate = "START";

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
            gamestate = "HIT";
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key ==  "z") {
            gamestate = "PREHOLD";
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
        cardBackSprite.alpha = 1;
    }

    playerSumText.x = 0; dealerSumText.x = 0;
    playerSumText.y = app.screen.height/4 + spacing; dealerSumText.y = -app.screen.height/4 + spacing;
    playerSumText.style.fontSize = Math.round(scale * 8);
    dealerSumText.style.fontSize = Math.round(scale * 8);
    

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
            case "START":
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

                drawCards(player);
                drawCards(dealer);
                drawDealerBackCard();
                playerSumText.text = player.GetDeckSum();
                dealerSumText.text = dealer.deck[1].gameValue + "+";

                if (player.GetDeckSum() > 21 || dealer.GetDeckSum() === 21) {
                    gamestate = "LOSE";
                    break;
                }
                if (player.GetDeckSum() === 21 || dealer.GetDeckSum() > 21) {
                    gamestate = "WIN";
                    break;
                }

                gamestate = "LOOP";

                break;
        
            case "HIT":
                player.Hit();

                drawCards(player);
                playerSumText.text = player.GetDeckSum();

                if (player.GetDeckSum() > 21 && dealer.GetDeckSum() > 21) {
                    gamestate = "TIE";
                    break;
                }
                if (player.GetDeckSum() > 21 || dealer.GetDeckSum() === 21) {
                    gamestate = "LOSE";
                    break;
                }
                if (player.GetDeckSum() === 21 || dealer.GetDeckSum() > 21) {
                    gamestate = "WIN";
                    break;
                }

                gamestate = "LOOP";

                break;
            case "PREHOLD": // Time to drop backcard
                dealerSumText.text = dealer.GetDeckSum();
                cardBackSprite.alpha -= ticker.deltaTime * 0.05;
                cardBackSprite.y += ticker.deltaTime * 1;
                if (cardBackSprite.alpha <= 0) {
                    container.removeChild(cardBackSprite);
                    sleep = 1000;
                    waiting = true;
                    gamestate = "HOLD";
                }

                break;
            case "HOLD":
                if (player.GetDeckSum() < dealer.GetDeckSum() && dealer.GetDeckSum() < 22) {
                    gamestate = "LOSE";
                    break;
                }
                if (dealer.GetDeckSum() === 21 && player.GetDeckSum() === 21) {
                    gamestate = "TIE";
                    break;
                }
                if (dealer.GetDeckSum() > 21) {
                    gamestate = "WIN";
                    break;
                }
                if (player.GetDeckSum() >= dealer.GetDeckSum() && dealer.GetDeckSum() != 21) {
                    dealer.Hit();
                    sleep = 1000;
                    waiting = true;

                    drawCards(dealer);
                    dealerSumText.text = dealer.GetDeckSum();
                }

                break;
            case "LOSE":
                playerSumText.text = "LOSE";
                sleep = 2000;
                waiting = true;

                gamestate = "START";

                break;
            case "WIN":
                playerSumText.text = "WIN";
                sleep = 2000;
                waiting = true;

                gamestate = "START";

                break;
            case "TIE":
            playerSumText.text = "TIE";
            sleep = 2000;
            waiting = true;

            gamestate = "START";

            break;

            default:
                break;
        }
    })
})();
