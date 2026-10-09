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
        text: "LOADING",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5
    });
    const dealerSumText = new Text({
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5
    });
    const playerBalanceText = new Text({
        style: {
            fill: "#ffffe0",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5}
    });
    const playerBetText = new Text({
        text: "LOADING",
        style: {
            fill: "#ff5733",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5}
    });

    const keyZText = new Text({
        text: "Hold",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6}
    });
    const keyXText = new Text({
        text: "Hit",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6}
    });
    const keyVText = new Text({
        text: "Bet+",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6}
    });
    const keyCText = new Text({
        text: "Bet-",
        style: {
            fill: "#FFFFFF",
            fontSize: 36,
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6}
    });
    container.addChild(playerSumText);
    container.addChild(dealerSumText);
    container.addChild(playerBalanceText);
    container.addChild(playerBetText);
    container.addChild(keyZText);
    container.addChild(keyXText);
    container.addChild(keyVText);
    container.addChild(keyCText);

    const keyZTexture = await Assets.load("/assets/card54.png");
    const keyXTexture = await Assets.load("/assets/card55.png");
    const keyVTexture = await Assets.load("/assets/card57.png");
    const keyCTexture = await Assets.load("/assets/card58.png");
    keyZTexture.source.scaleMode = "nearest";
    keyXTexture.source.scaleMode = "nearest";
    keyVTexture.source.scaleMode = "nearest";
    keyCTexture.source.scaleMode = "nearest";
    const keyZSprite = new Sprite(keyZTexture);
    const keyXSprite = new Sprite(keyXTexture);
    const keyVSprite = new Sprite(keyVTexture);
    const keyCSprite = new Sprite(keyCTexture);
    keyZSprite.anchor.set(0.5);
    keyXSprite.anchor.set(0.5);
    keyVSprite.anchor.set(0.5);
    keyCSprite.anchor.set(0.5);
    container.addChild(keyZSprite);
    container.addChild(keyXSprite);
    container.addChild(keyVSprite);
    container.addChild(keyCSprite);

    // Game logic
    let gamestate = "RESET";

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
            if (gamestate === "LOOP") gamestate = "HIT";
            else if (gamestate === "BET") gamestate = "START";
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key ==  "z" && gamestate === "LOOP") {
            gamestate = "PREHOLD";
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key ==  "w" && gamestate === "BET") {
            if (player.bet < player.balance) {
                player.bet += 50;
                playerBetText.text = "BET $" + player.bet;
            }
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key ==  "s" && gamestate === "BET") {
            if (player.bet > 50) {
                player.bet -= 50;
                playerBetText.text = "BET $" + player.bet;
            }
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key ==  " ") {
            container.addChild(keyZSprite);
            container.addChild(keyXSprite);
            container.addChild(keyVSprite);
            container.addChild(keyCSprite);
            container.addChild(keyZText);
            container.addChild(keyXText);
            container.addChild(keyVText);
            container.addChild(keyCText);
        }
    })
    document.addEventListener("keyup", (event) => {
        if (event.key ==  " ") {
            container.removeChild(keyZSprite);
            container.removeChild(keyXSprite);
            container.removeChild(keyVSprite);
            container.removeChild(keyCSprite);
            container.removeChild(keyZText);
            container.removeChild(keyXText);
            container.removeChild(keyVText);
            container.removeChild(keyCText);
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
    playerBalanceText.x = -app.screen.width/2 + 64;
    playerBalanceText.y = -spacing/4;
    playerBalanceText.style.fontSize = Math.round(scale * 8);
    playerBetText.x = -app.screen.width/2 + 64;
    playerBetText.y = spacing/4;
    playerBetText.style.fontSize = Math.round(scale * 8);

    keyZSprite.scale.set(scale/4);
    keyXSprite.scale.set(scale/4);
    keyVSprite.scale.set(scale/4);
    keyCSprite.scale.set(scale/4);
    keyZSprite.y = app.screen.height/2 - spacing*2;
    keyXSprite.y = app.screen.height/2 - spacing*1.5;
    keyVSprite.y = app.screen.height/2 - spacing;
    keyCSprite.y = app.screen.height/2 - spacing/2;
    keyZSprite.x = app.screen.width/2 - spacing*2;
    keyXSprite.x = app.screen.width/2 - spacing*2;
    keyVSprite.x = app.screen.width/2 - spacing*2;
    keyCSprite.x = app.screen.width/2 - spacing*2;
    
    keyZText.y = app.screen.height/2 - spacing*2;
    keyXText.y = app.screen.height/2 - spacing*1.5;
    keyVText.y = app.screen.height/2 - spacing;
    keyCText.y = app.screen.height/2 - spacing/2;
    keyZText.x = app.screen.width/2 - spacing*1.7;
    keyXText.x = app.screen.width/2 - spacing*1.7;
    keyVText.x = app.screen.width/2 - spacing*1.7;
    keyCText.x = app.screen.width/2 - spacing*1.7;

    keyZText.style.fontSize = Math.round(scale * 6);
    keyXText.style.fontSize = Math.round(scale * 6);
    keyVText.style.fontSize = Math.round(scale * 6);
    keyCText.style.fontSize = Math.round(scale * 6);

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
            case "RESET":
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

                if (player.bet > player.balance) player.bet = player.balance;

                playerSumText.text = "PLACE YOUR BETS";
                dealerSumText.text = "";
                playerBalanceText.text = "CASH $" + player.balance;
                playerBetText.text = "BET $" + player.bet;

                gamestate = "BET";

                break;
            case "START":
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
                player.balance -= player.bet;

                sleep = 2000;
                waiting = true;

                gamestate = "RESET";

                break;
            case "WIN":
                playerSumText.text = "WIN";
                player.balance += player.bet;

                sleep = 2000;
                waiting = true;

                gamestate = "RESET";

                break;
            case "TIE":
                playerSumText.text = "TIE";

                sleep = 2000;
                waiting = true;

                gamestate = "RESET";

                break;

            default:
                break;
        }
    })
})();
