import { Application, Assets, Sprite, Container, Text, SCALE_MODES } from "pixi.js";
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
    const scale = ((app.screen.width / 2560) * 0.7 + (app.screen.height / 1440) * 0.3)*8;
    const spacing = scale*24;

    // Text
    const font = new FontFace(
        "PrimaryFont",
        "url('/assets/Silkscreen-Regular.ttf')"
    );
    await font.load();
    document.fonts.add(font);

    const playerSumText = new Text({ 
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 8),
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5,
        position: {x: 0, y: app.screen.height/4 + spacing}
    });
    const dealerSumText = new Text({
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 8),
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5,
        position: {x: 0, y: -app.screen.height/4 + spacing}
    });
    const playerBalanceText = new Text({
        style: {
            fill: "#ffffe0",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0},
        position: {x: -app.screen.width/2 + spacing*1.1, y: app.screen.height/2 - spacing/1.3}
    });
    const playerBetText = new Text({
        style: {
            fill: "#ff5733",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0},
        position: {x: -app.screen.width/2 + spacing*1.1, y: app.screen.height/2 - spacing/2}
    });
    const playerNameText = new Text({
        text: "Player",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 5),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0},
        position: {x: -app.screen.width/2 + spacing*1.12, y: app.screen.height/2 - spacing}
    });
    const dealerNameText = new Text({
        text: "Evil\nDealer",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 5),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0},
        position: {x: -app.screen.width/2 + spacing*1.12, y: -app.screen.height/2 + spacing/6}
    });

    const keyZText = new Text({
        text: "Hold",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6},
        position: {x: app.screen.width/2 - spacing*1.1, y: app.screen.height/2 - spacing*2.5}
    });
    const keyXText = new Text({
        text: "Hit",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6},
        position: {x: app.screen.width/2 - spacing*1.1, y: app.screen.height/2 - spacing*2}
    });
    const keyVText = new Text({
        text: "Bet+",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6},
        position: {x: app.screen.width/2 - spacing*1.1, y: app.screen.height/2 - spacing*1.5}
    });
    const keyCText = new Text({
        text: "Bet-",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6},
        position: {x: app.screen.width/2 - spacing*1.1, y: app.screen.height/2 - spacing}
    });
    const keySpaceText = new Text({
        text: "Hold",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 8),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.6},
        position: {x: app.screen.width/2 - spacing*1.1, y: app.screen.height/4 + spacing}
    });

    // Sprites
    const keyZTexture = await Assets.load({src: "/assets/keyboard_z.png", data: {scaleMode: "nearest"}});
    const keyXTexture = await Assets.load({src: "/assets/keyboard_x.png", data: {scaleMode: "nearest"}});
    const keyVTexture = await Assets.load({src: "/assets/keyboard_w.png", data: {scaleMode: "nearest"}});
    const keyCTexture = await Assets.load({src: "/assets/keyboard_s.png", data: {scaleMode: "nearest"}});
    const keySpaceTexture = await Assets.load({src: "/assets/keyboard_space.png", data: {scaleMode: "nearest"}});
    const playerTexture = await Assets.load({src: "/assets/player.png", data: {scaleMode: "nearest"}});
    const dealerTexture = await Assets.load({src: "/assets/dealer.png", data: {scaleMode: "nearest"}});

    const cardBackTexture = await Assets.load({src: "/assets/card53.png", data: {scaleMode: "nearest"}});
    const cardEmptyTexture1 = await Assets.load({src: "/assets/card59.png", data: {scaleMode: "nearest"}});
    const cardEmptyTexture2 = await Assets.load({src: "/assets/card59.png", data: {scaleMode: "nearest"}});

    const keyZSprite = new Sprite({texture: keyZTexture, anchor: 0.5, position: {x: app.screen.width/2 - spacing*1.4, y: app.screen.height/2 - spacing*2.5}, scale: scale/6});
    const keyXSprite = new Sprite({texture: keyXTexture, anchor: 0.5, position: {x: app.screen.width/2 - spacing*1.4, y: app.screen.height/2 - spacing*2}, scale: scale/6});
    const keyVSprite = new Sprite({texture: keyVTexture, anchor: 0.5, position: {x: app.screen.width/2 - spacing*1.4, y: app.screen.height/2 - spacing*1.5}, scale: scale/6});
    const keyCSprite = new Sprite({texture: keyCTexture, anchor: 0.5, position: {x: app.screen.width/2 - spacing*1.4, y: app.screen.height/2 - spacing}, scale: scale/6});
    const keySpaceSprite = new Sprite({texture: keySpaceTexture, anchor: 0.5, position: {x: app.screen.width/2 - spacing*1.6, y: app.screen.height/4 + spacing}, scale: scale/3});
    const playerSprite = new Sprite({texture: playerTexture, anchor: {x: 0, y: 1}, position: {x: -app.screen.width/2 + spacing/6, y: app.screen.height/2 - spacing/6}, scale: scale/1.6});
    const dealerSprite = new Sprite({texture: dealerTexture, position: {x: -app.screen.width/2 + spacing/6, y: -app.screen.height/2 + spacing/6}, scale: scale/1.6});

    const cardBackSprite = new Sprite({texture: cardBackTexture, anchor: 0.5, position: {y: 0}});
    const cardEmptySprite1 = new Sprite({texture: cardEmptyTexture1, anchor: 0.5, position: {x: -spacing/2, y: app.screen.height/4}, alpha: 0.9, scale: scale});
    const cardEmptySprite2 = new Sprite({texture: cardEmptyTexture2, anchor: 0.5, position: {x: spacing/2, y: app.screen.height/4}, alpha: 0.7, scale: scale});
    
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

    // Game logic
    let gamestate = "RESET";

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
            container.removeChild(keySpaceSprite);
            container.removeChild(keySpaceText);
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
            container.addChild(keySpaceSprite);
            container.addChild(keySpaceText);
        }
    })

    let elapsed = 0;
    let sleep = 0;
    let waiting = false;

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

    container.addChild(keySpaceSprite);
    container.addChild(keySpaceText);
    container.addChild(playerSprite);
    container.addChild(dealerSprite);
    container.addChild(playerNameText);
    container.addChild(dealerNameText);
    container.addChild(playerSumText);
    container.addChild(dealerSumText);
    container.addChild(playerBalanceText);
    container.addChild(playerBetText);

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
                container.addChild(cardEmptySprite1);
                container.addChild(cardEmptySprite2);

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
                container.removeChild(cardEmptySprite1);
                container.removeChild(cardEmptySprite2);

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
