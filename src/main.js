import { Application, Assets, Sprite, Container, Text } from "pixi.js";
import { Table, Player } from "./blackjack";

(async () => {
     // Create a new application
     const app = new Application();

     // Initialize the application
    await app.init({ background: "#00563F", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container").appendChild(app.canvas);

    const font = new FontFace(
        "PrimaryFont",
        "url('/assets/Silkscreen-Regular.ttf')"
    );
    await font.load();
    document.fonts.add(font);

    // Render setup
    const scale = ((app.screen.width / 2560) * 0.7 + (app.screen.height / 1440) * 0.3)*8;
    const spacing = scale*24;

    const container = new Container({position: {x: app.screen.width/2, y: app.screen.height/2}});
    const shopContainer = new Container({position: {x: 0, y: 0}, zIndex: 2, label: "shopBg"});
    app.stage.addChild(container);

    // Sprites
    const centerText = new Text({
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 7),
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5,
        position: {x: 0, y: 0}
    });

    const shopBgTexture = await Assets.load({src: "/assets/shopbg.png", data: {scaleMode: "nearest"}});
    const keyZTexture = await Assets.load({src: "/assets/keyboard_z.png", data: {scaleMode: "nearest"}});
    const keyXTexture = await Assets.load({src: "/assets/keyboard_x.png", data: {scaleMode: "nearest"}});
    const keyVTexture = await Assets.load({src: "/assets/keyboard_w.png", data: {scaleMode: "nearest"}});
    const keyCTexture = await Assets.load({src: "/assets/keyboard_s.png", data: {scaleMode: "nearest"}});
    const playerTexture = await Assets.load({src: "/assets/player.png", data: {scaleMode: "nearest"}});
    const dealerTexture = await Assets.load({src: "/assets/dealer.png", data: {scaleMode: "nearest"}});
    const shopTexture = await Assets.load({src: "/assets/shop.png", data: {scaleMode: "nearest"}});
    const cardBackTexture = await Assets.load({src: "/assets/card53.png", data: {scaleMode: "nearest"}});
    const cardEmptyTexture1 = await Assets.load({src: "/assets/card59.png", data: {scaleMode: "nearest"}});
    const cardEmptyTexture2 = await Assets.load({src: "/assets/card59.png", data: {scaleMode: "nearest"}});
    const backcard3Texture = await Assets.load({src: "/assets/upBackcard.png", data: {scaleMode: "nearest"}});
    const profitTexture = await Assets.load({src: "/assets/upProfit.png", data: {scaleMode: "nearest"}});
    const bitTexture = await Assets.load({src: "/assets/bit.png", data: {scaleMode: "nearest"}});
    const buyBgGreenTexture = await Assets.load({src: "/assets/buyBgGreen.png", data: {scaleMode: "nearest"}});
    
    const shopBgSprite = new Sprite({texture: shopBgTexture, anchor: 0.5, position: {x: 0, y: 0}, scale: scale})

    const keyZSprite = new Sprite({texture: keyZTexture, anchor: 0.5, position: {x: 0, y: -app.screen.height / 4}, scale: scale/6});
    const keyXSprite = new Sprite({texture: keyXTexture, anchor: 0.5, position: {x: 0, y: app.screen.height/4}, scale: scale/6});
    const keyX2Sprite = new Sprite({texture: keyXTexture, anchor: 0.5, position: {x: centerText.x-centerText.width/2-spacing/2, y: centerText.y}, scale: scale/6});
    const keyVSprite = new Sprite({texture: keyVTexture, anchor: 0.5, position: {x: 0, y: app.screen.height/2 - spacing/3}, scale: scale/8});
    const keyCSprite = new Sprite({texture: keyCTexture, anchor: 0.5, position: {x: 0, y: app.screen.height/2 - spacing/3}, scale: scale/8});
    const playerSprite = new Sprite({texture: playerTexture, anchor: {x: 0, y: 1}, position: {x: -app.screen.width/2 + spacing/6, y: app.screen.height/2 - spacing/6}, scale: scale/1.6});
    const dealerSprite = new Sprite({texture: dealerTexture, position: {x: -app.screen.width/2 + spacing/6, y: -app.screen.height/2 + spacing/6}, scale: scale/1.6});
    
    const cardBackSprite = new Sprite({texture: cardBackTexture, anchor: 0.5, position: {y: 0}});
    const cardEmptySprite1 = new Sprite({texture: cardEmptyTexture1, anchor: 0.5, position: {x: -spacing/2, y: app.screen.height/4}, alpha: 0.9, scale: scale});
    const cardEmptySprite2 = new Sprite({texture: cardEmptyTexture2, anchor: 0.5, position: {x: spacing/2, y: app.screen.height/4}, alpha: 0.7, scale: scale});

    const shopSprite = new Sprite({texture: shopTexture, anchor: {x: 1, y: 0}, position: {x: app.screen.width/2 - spacing/6, y: -app.screen.height/2 + spacing/6}, scale: scale/1.6, eventMode: "static", zIndex: 2});
    shopContainer.y = shopBgSprite.height/2 + shopSprite.y + shopSprite.height + scale;
    const backcard3Sprite = new Sprite({texture: backcard3Texture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing/2}, scale: scale});
    const profitSprite = new Sprite({texture: profitTexture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*2}, scale: scale});
    
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

    let player = new Player("Player", table);
    let dealer = new Player("Dealer", table);
    player.Reset();
    let gamestate = "MENU";

    // Text
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
        anchor: 0,
        position: {x: -app.screen.width/2 + spacing*1.1, y: app.screen.height/2 - spacing/1.3}
    });
    const playerBetText = new Text({
        style: {
            fill: "#ff5733",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: 0,
        position: {x: -app.screen.width/2 + spacing*1.1, y: app.screen.height/2 - spacing/2}
    });
    const playerNameText = new Text({
        text: "Player",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 5),
            fontFamily: "PrimaryFont"
        },
        anchor: 0,
        position: {x: -app.screen.width/2 + spacing*1.12, y: app.screen.height/2 - spacing}
    });
    const dealerNameText = new Text({
        text: "Evil\nDealer",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 5),
            fontFamily: "PrimaryFont"
        },
        anchor: 0,
        position: {x: -app.screen.width/2 + spacing*1.12, y: -app.screen.height/2 + spacing/6}
    });

    const shopText = new Text({
        text: "Shop",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale * 6),
            fontFamily: "PrimaryFont"
        },
        anchor: 0.5,
        position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 - spacing/4}
    })
    const backcard3Text = new Text({
        text: "Backcard\nShow backcard\non the next 3 rounds",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale*4),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5},
        position: {x: backcard3Sprite.x + spacing/2, y: backcard3Sprite.y}
    })
    const profitText = new Text({
        text: "Profit+\nWinnings give\n1% of the bet",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale*4),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5},
        position: {x: profitSprite.x + spacing/2, y: profitSprite.y}
    })
    const deckCountText = new Text({
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale*4),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5},
        position: {x: 0, y: spacing}
    })
 
        // Shop items
    const ITEMS = {
        profit: {
            id: "profit",
            name: "Profit+",
            description: "Winnings give 5% of the bet",
            price: 300,
            priceCf: 1.25,
            maxAmount: 10,
            get x() {
                return profitText.x + spacing / 6 + profitText.width / 2;
            },
            get y() {
                return profitText.y - profitText.height / 3;
            },
            get buttonX() {
                return profitSprite.x - backcard3Sprite.width / 2;
            },
            get buttonY() {
                return profitSprite.y + profitSprite.height - scale * 2;
            }
        },

        backcard3: {
            id: "backcard3",
            name: "Backcard",
            description: "Show backcard on the next 3 rounds",
            price: 10,
            priceCf: 1,
            maxAmount: 1,
            get x() {
                return backcard3Text.x + backcard3Text.width / 2;
            },
            get y() {
                return backcard3Text.y - backcard3Text.height / 3;
            },
            get buttonX() {
                return backcard3Sprite.x - backcard3Sprite.width / 2;
            },
            get buttonY() {
                return backcard3Sprite.y + backcard3Sprite.height - scale * 2;
            }
        },

        kill: {
            id: "kill",
            name: "Kill",
            description: "Special item",
            price: 10000,
            maxAmount: 1,
        },
    };

    shopContainer.addChild(shopBgSprite, backcard3Sprite, profitSprite, shopText, backcard3Text, profitText);

    shopSprite.on("pointerover", () => {shopSprite.alpha = 0.4;});
    shopSprite.on("pointerout", () => {if (gamestate === "BET")shopSprite.alpha = 1;});
    shopSprite.on("click", () => {
        if (gamestate !== "BET") return;
        drawAmountBits(ITEMS.profit.x, ITEMS.profit.y, player.inventory.profit, ITEMS.profit.maxAmount, "profit");
        drawAmountBits(ITEMS.backcard3.x, ITEMS.backcard3.y, player.inventory.backcard3, ITEMS.backcard3.maxAmount, "backcard3");
        drawBuyButton(profitSprite.x-backcard3Sprite.width/2, profitSprite.y+profitSprite.height-scale*2, "profit");
        drawBuyButton(backcard3Sprite.x-backcard3Sprite.width/2, backcard3Sprite.y+backcard3Sprite.height-scale*2, "backcard3");
        if (container.getChildByLabel("shopBg")) {
            const animate = () => {
                shopContainer.x += app.ticker.deltaMS*scale/2;
                if (shopContainer.x >= app.screen.width/2 + shopBgSprite.width/2) {
                    shopContainer.x = app.screen.width/2 + shopBgSprite.width/2;
                    app.ticker.remove(animate);
                    container.removeChild(shopContainer);
                }
            };
            app.ticker.add(animate);
        }
        else {
            shopContainer.x = app.screen.width/2 + shopBgSprite.width/2;
            shopSprite.alpha = 0.6;
            container.addChild(shopContainer);
            const animate = () => {
                shopContainer.x -= app.ticker.deltaMS*scale/2;
                if (shopContainer.x <= app.screen.width/2-shopContainer.width/2-spacing/4) {
                    shopContainer.x = app.screen.width/2-shopContainer.width/2-spacing/4;
                    app.ticker.remove(animate);
                }
            };
            app.ticker.add(animate);
        }
    });

    function buyItem(itemID) {
        const item = ITEMS[itemID];

        if (item.price >= player.balance-player.betDefault) return;
        if (item.maxAmount <= player.inventory[itemID]) return;

        player.balance -= item.price;
        playerBalanceText.text = "CASH $" + player.balance;
        player.inventory[itemID] += 1;
        item.price = Math.round(item.price*item.priceCf);

        drawAmountBits(item.x, item.y, player.inventory[itemID], item.maxAmount, itemID);
        if (buyButtons[itemID]) {
            buyButtons[itemID].text.text = "$" + item.price;
        }
    }

    const itemBits = {};
    function drawAmountBits(x, y, amount, maxAmount, itemID) {
        if (itemBits[itemID]) {
            for (const sprite of itemBits[itemID]) {
                shopContainer.removeChild(sprite);
                sprite.destroy();
            }
        }

        itemBits[itemID] = [];

        for (let i = 1; i <= maxAmount; i++) {
            const bitSprite = new Sprite({
                texture: bitTexture,
                anchor: 0.5,
                position: {
                    x: x + scale * i * 4,
                    y: y
                },
                scale: scale
            });

            if (i > amount) {
                bitSprite.alpha = 0.2;
            }
            else bitSprite.alpha = 1;

            itemBits[itemID].push(bitSprite);
            shopContainer.addChild(bitSprite);
        }
    }
    const buyButtons = {};
    function drawBuyButton(x, y, itemID) {
        const item = ITEMS[itemID];

        if (buyButtons[itemID]) {
            buyButtons[itemID].text.text = "$" + item.price;
            return;
        }

        const buyButtonBg = new Sprite({texture: buyBgGreenTexture, position: {x: x, y: y}, scale: scale, anchor: {x: 0, y: 0.5}, eventMode: "static"});
        const buyButtonText = new Text({
            text: "$" + item.price,
            style: {
                fill: "#FFFFFF",
                fontSize: Math.round(scale * 4),
                fontFamily: "PrimaryFont"
            },
            anchor: 0.5,
            position: {x: buyButtonBg.x+buyButtonBg.width/2, y: buyButtonBg.y}
        })
        shopContainer.addChild(buyButtonBg, buyButtonText);
            buyButtons[itemID] = {
            bg: buyButtonBg,
            text: buyButtonText
        };
        buyButtonBg.on("pointerover", () => {
            buyButtonBg.alpha = 0.4;
        })
        buyButtonBg.on("pointerout", () => {
            buyButtonBg.alpha = 1;
        })
        buyButtonBg.on("click", () => {
            buyItem(itemID);
            console.log(player.inventory);
        })
    }

    // Game logic
    function updateKeys() {
        keyVSprite.x = playerBetText.x + playerBetText.width + spacing/4;
        keyCSprite.x = playerBetText.x + playerBetText.width + spacing/1.8;
        keyXSprite.x = player.deck.length * spacing/1.4;
        keyZSprite.x = dealer.deck.length * spacing/1.4;
    }

    document.addEventListener("keydown", (event) => {
        if (event.key ==  "x") {
            if (gamestate === "LOOP") {
                keyXSprite.alpha = 0.6;
                gamestate = "HIT";
            }
            else if (gamestate === "BET") {
                keyXSprite.alpha = 0.6;
                gamestate = "START";
            }
            else if (gamestate === "MENU_WAIT") {
                keyX2Sprite.alpha = 0.6;
                gamestate = "RESET";
            }
        }
        if (event.key ==  "z" && gamestate === "LOOP") {
            if (container.getChildByLabel("shopBg")) return;
            gamestate = "PREHOLD";
            keyZSprite.alpha = 0.6;
        }
        if (event.key ==  "w" && gamestate === "BET") {
            if (player.bet < player.balance) {
                keyVSprite.alpha = 0.6;
                player.bet += 50;
                playerBetText.text = "BET $" + player.bet;
                updateKeys();
            }
        }
        if (event.key ==  "s" && gamestate === "BET") {
            if (player.bet > 50) {
                keyCSprite.alpha = 0.6;
                player.bet -= 50;
                playerBetText.text = "BET $" + player.bet;
                updateKeys();
            }
        }
    })
    document.addEventListener("keyup", (event) => {
        if (event.key == "x") {
            keyXSprite.alpha = 1;
            keyX2Sprite.alpha = 1;
        }
        if (event.key == "z") {
            keyZSprite.alpha = 1;
        }
        if (event.key == "w") {
            keyVSprite.alpha = 1;
        }
        if (event.key == "s") {
            keyCSprite.alpha = 1;
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
            updateKeys();
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
            case "MENU":
                for (const card of player.deck) {
                    container.removeChild(card.sprite);
                }
                for (const card of dealer.deck) {
                    container.removeChild(card.sprite);
                }
                container.removeChildren();
                if (player.balance <= 0) centerText.text = "It's so over..\nstart a new game?";
                else centerText.text = "Start a new Ventti";
                keyX2Sprite.position = {x: centerText.x-centerText.width/2-spacing/2, y: centerText.y};
                container.addChild(centerText, keyX2Sprite);

                player.Reset();
                table.GenerateDeck();

                gamestate = "MENU_WAIT";

                break;
            case "MENU_WAIT":
                break;

            case "RESET":
                if (player.balance <= 0) {
                    gamestate = "MENU";
                    break;
                }
                if (table.deck.length < 1) table.GenerateDeck();
                for (const card of player.deck) {
                    container.removeChild(card.sprite);
                }
                for (const card of dealer.deck) {
                    container.removeChild(card.sprite);
                }
                centerText.text = "Take two cards <--";
                keyX2Sprite.position = {x: centerText.x-centerText.width/2-spacing/2, y: centerText.y};
                container.removeChild(cardBackSprite, keyXSprite, keyZSprite);
                container.addChild(playerSprite, dealerSprite, shopSprite, playerNameText, dealerNameText, keyX2Sprite, centerText, keyVSprite, keyCSprite, playerSumText, dealerSumText, playerBalanceText, playerBetText);
                shopSprite.alpha = 1;

                player.deck = [];
                dealer.deck = [];

                if (player.bet > player.balance) player.bet = player.balance;

                playerSumText.text = "";
                dealerSumText.text = "";
                playerBalanceText.text = "CASH $" + player.balance;
                playerBetText.text = "BET $" + player.bet;
                updateKeys();
                keyXSprite.x = spacing*1.24;

                gamestate = "BET";

                break;
            case "START":
                if (container.getChildByLabel("shopBg")) {
                    const animate = () => {
                        shopContainer.x += app.ticker.deltaMS*scale/2;
                        if (shopContainer.x >= app.screen.width/2 + shopBgSprite.width/2) {
                            shopContainer.x = app.screen.width/2 + shopBgSprite.width/2;
                            app.ticker.remove(animate);
                            container.removeChild(shopContainer);
                        }
                    };
                    app.ticker.add(animate);
                }
                container.removeChild(cardEmptySprite1, cardEmptySprite2, keyVSprite, keyCSprite, centerText, keyX2Sprite);
                container.addChild(keyXSprite, keyZSprite);

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

                if (player.inventory.backcard3 > 0) {
                    gamestate = "REVEAL_BACKCARD";
                    break;
                }
                

                gamestate = "LOOP";
                shopSprite.alpha = 0.4;

                break;

            case "REVEAL_BACKCARD":
                cardBackSprite.alpha -= ticker.deltaTime * 0.05;
                cardBackSprite.y += ticker.deltaTime * 1;

                if (cardBackSprite.alpha <= 0) {
                    cardBackSprite.alpha = 0;
                    container.removeChild(cardBackSprite);
                    player.inventory.backcard3--;
                    drawAmountBits(ITEMS.backcard3.x, ITEMS.backcard3.y, player.inventory.backcard3, ITEMS.backcard3.maxAmount, "backcard3");

                    dealerSumText.text = dealer.GetDeckSum();

                    sleep = 1000;
                    waiting = true;

                    if (player.GetDeckSum() > 21 || dealer.GetDeckSum() === 21) {
                        gamestate = "LOSE";
                    }
                    else if (player.GetDeckSum() === 21 || dealer.GetDeckSum() > 21) {
                        gamestate = "WIN";
                    } 
                    else {
                        gamestate = "LOOP";
                        shopSprite.alpha = 0.4;
                    }
                }

                break;
        
            case "HIT":
                player.Hit();

                drawCards(player);
                playerSumText.text = player.GetDeckSum();

                if (player.GetDeckSum() >= 21 && dealer.GetDeckSum() >= 21) {
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
                if (player.inventory.backcard3 > 0) {
                    gamestate = "HOLD";
                    break;
                }
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
                    if (table.deck.length > 0) {
                        dealer.Hit();
                    }
                    else {
                        table.GenerateDeck();
                    }
                    
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
                player.balance += player.bet + (player.bet*player.inventory.profit)*0.05;

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
