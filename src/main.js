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
    let scale = ((app.screen.width / 2560) * 0.7 + (app.screen.height / 1440) * 0.3)*8;
    let spacing = scale*24;

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
    const buyBgRedTexture = await Assets.load({src: "/assets/buyBgRed.png", data: {scaleMode: "nearest"}});
    const buyBgGrayTexture = await Assets.load({src: "/assets/buyBgGray.png", data: {scaleMode: "nearest"}});
    const profitGoldTexture = await Assets.load({src: "/assets/upProfitGold.png", data: {scaleMode: "nearest"}});
    const endTexture = await Assets.load({src: "/assets/upEnd.png", data: {scaleMode: "nearest"}});
    const endVisTexture = await Assets.load({src: "/assets/upEndVis.png", data: {scaleMode: "nearest"}});
    const heartTexture = await Assets.load({src: "/assets/heart.png", data: {scaleMode: "nearest"}});
    
    const shopBgSprite = new Sprite({texture: shopBgTexture, anchor: 0.5, position: {x: 0, y: 0}, scale: scale})

    const keyZSprite = new Sprite({texture: keyZTexture, anchor: 0.5, position: {x: 0, y: -app.screen.height / 4}, scale: scale/6});
    const keyXSprite = new Sprite({texture: keyXTexture, anchor: 0.5, position: {x: 0, y: app.screen.height/4}, scale: scale/6});
    const keyX2Sprite = new Sprite({texture: keyXTexture, anchor: 0.5, position: {x: centerText.x-centerText.width/2-spacing*0.2, y: centerText.y}, scale: scale/6});
    const keyVSprite = new Sprite({texture: keyVTexture, anchor: 0.5, position: {x: 0, y: app.screen.height/2 - spacing/3}, scale: scale/8});
    const keyCSprite = new Sprite({texture: keyCTexture, anchor: 0.5, position: {x: 0, y: app.screen.height/2 - spacing/3}, scale: scale/8});
    const playerSprite = new Sprite({texture: playerTexture, anchor: {x: 0, y: 1}, position: {x: -app.screen.width/2 + spacing/6, y: app.screen.height/2 - spacing/6}, scale: scale/1.6});
    const dealerSprite = new Sprite({texture: dealerTexture, position: {x: -app.screen.width/2 + spacing/6, y: -app.screen.height/2 + spacing/6}, scale: scale/1.6});
    
    const cardBackSprite = new Sprite({texture: cardBackTexture, anchor: 0.5, position: {y: 0}});
    const cardEmptySprite1 = new Sprite({texture: cardEmptyTexture1, anchor: 0.5, position: {x: -spacing/2, y: app.screen.height/4}, alpha: 0.9, scale: scale});
    const cardEmptySprite2 = new Sprite({texture: cardEmptyTexture2, anchor: 0.5, position: {x: spacing/2, y: app.screen.height/4}, alpha: 0.7, scale: scale});

    const shopSprite = new Sprite({texture: shopTexture, anchor: {x: 1, y: 0}, position: {x: app.screen.width/2 - spacing/6, y: -app.screen.height/2 + spacing/6}, scale: scale/1.6, eventMode: "static", zIndex: 2});
    shopContainer.y = shopBgSprite.height/2 + shopSprite.y + shopSprite.height + scale;
    const backcard3Sprite = new Sprite({texture: backcard3Texture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*0.5}, scale: scale});
    const profitSprite = new Sprite({texture: profitTexture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*2}, scale: scale});
    const profitGoldSprite = new Sprite({texture: profitGoldTexture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*3.5}, scale: scale});
    const endSprite = new Sprite({texture: endTexture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*5}, scale: scale});
    const endVisSprite = new Sprite({texture: endVisTexture, anchor: 0.5, position: {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*5}, scale: scale, alpha: 0});
    
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
    player.LoadData();
    dealer.LoadData();

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
        text: "Profit+\nWinnings give\n5% of the bet",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale*4),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5},
        position: {x: profitSprite.x + spacing/2, y: profitSprite.y}
    })
    const profitGoldText = new Text({
        text: "Profit++\nWinnings give\n12% of the bet",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale*4),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5},
        position: {x: profitGoldSprite.x + spacing/2, y: profitGoldSprite.y}
    })
    const endText = new Text({
        text: "The End\nEarn 25k\nto unlock this",
        style: {
            fill: "#FFFFFF",
            fontSize: Math.round(scale*4),
            fontFamily: "PrimaryFont"
        },
        anchor: {x: 0, y: 0.5},
        position: {x: endSprite.x + spacing/2, y: endSprite.y}
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
            price: 100,
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

        profitGold: {
            id: "profitGold",
            name: "Profit++",
            description: "Winnings give 12% of the bet",
            price: 1000,
            priceCf: 1.75,
            maxAmount: 5,
            get x() {
                return profitGoldText.x + spacing / 6 + profitGoldText.width / 2;
            },
            get y() {
                return profitGoldText.y - profitGoldText.height / 3;
            },
            get buttonX() {
                return profitGoldSprite.x - profitGoldSprite.width / 2;
            },
            get buttonY() {
                return profitGoldSprite.y + profitGoldSprite.height - scale * 2;
            }
        },

        kill: {
            id: "kill",
            name: "Kill",
            description: "Special item",
            price: 30000,
            priceCf: 1,
            maxAmount: 1,
            get x() {
                return endText.x + spacing / 6 + endText.width / 2;
            },
            get y() {
                return endText.y - endText.height / 3;
            },
            get buttonX() {
                return endSprite.x - endSprite.width / 2;
            },
            get buttonY() {
                return endSprite.y + endSprite.height - scale * 2;
            }
        },
    };

    shopContainer.addChild(shopBgSprite, backcard3Sprite, profitSprite, profitGoldSprite, endSprite, endVisSprite, shopText, backcard3Text, profitText, profitGoldText, endText);

    shopSprite.on("pointerover", () => {shopSprite.alpha = 0.4;});
    shopSprite.on("pointerout", () => {if (gamestate === "BET")shopSprite.alpha = 1;});
    shopSprite.on("click", () => {
        if (gamestate !== "BET") return;
        drawAmountBits(ITEMS.profit.x, ITEMS.profit.y, player.inventory.profit, ITEMS.profit.maxAmount, "profit");
        drawAmountBits(ITEMS.backcard3.x, ITEMS.backcard3.y, player.inventory.backcard3, ITEMS.backcard3.maxAmount, "backcard3");
        drawAmountBits(ITEMS.profitGold.x, ITEMS.profitGold.y, player.inventory.profitGold, ITEMS.profitGold.maxAmount, "profitGold");
        drawBuyButton(profitSprite.x-backcard3Sprite.width/2, profitSprite.y+profitSprite.height-scale*2, "profit");
        drawBuyButton(backcard3Sprite.x-backcard3Sprite.width/2, backcard3Sprite.y+backcard3Sprite.height-scale*2, "backcard3");
        drawBuyButton(profitGoldSprite.x-backcard3Sprite.width/2, profitGoldSprite.y+profitGoldSprite.height-scale*2, "profitGold");
        drawBuyButton(endSprite.x-endSprite.width/2, endSprite.y+endSprite.height-scale*2, "kill");
        if (player.endgame >= 1) buyButtons["kill"].text.text = "$" + ITEMS.kill.price;
        else if (player.endgame == 0) buyButtons["kill"].text.text = "?";
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
            updateButtonColor("profit");
            updateButtonColor("backcard3");
            updateButtonColor("profitGold");
            updateButtonColor("kill");
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

    const buyButtons = {};

    function updateButtonColor(itemID) {
        const item = ITEMS[itemID];
        let colorTexture;
        if (player.inventory[itemID] >= item.maxAmount) colorTexture = buyBgGrayTexture;
        else if (player.balance - player.betDefault >= item.price) colorTexture = buyBgGreenTexture;
        else colorTexture = buyBgRedTexture;

        buyButtons[itemID].bg.texture = colorTexture;
        buyButtons[itemID].texture = colorTexture;
        buyButtons[itemID].text.text = itemID === "kill" && !player.endgame ? "?" : "$" + item.price;
    }

    function buyItem(itemID) {
        const item = ITEMS[itemID];

        if (item.price >= player.balance-player.betDefault) return;
        if (item.maxAmount <= player.inventory[itemID]) return;

        player.balance -= item.price;
        if (player.bet > player.balance) player.bet = player.balance;
        playerBalanceText.text = "CASH $" + player.balance;
        playerBetText.text = "BET $" + player.bet;
        player.inventory[itemID] += 1;
        item.price = Math.round(item.price*item.priceCf);

        if (itemID != "kill") drawAmountBits(item.x, item.y, player.inventory[itemID], item.maxAmount, itemID);
        updateButtonColor("profit");
        updateButtonColor("backcard3");
        updateButtonColor("profitGold");
        updateButtonColor("kill");
        player.SaveData();
        dealer.SaveData();
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
    function drawBuyButton(x, y, itemID) {
        const item = ITEMS[itemID];

        if (buyButtons[itemID]) {
            const button = buyButtons[itemID];

            button.bg.scale = scale;
            button.bg.position = {x: x, y: y};

            button.text.style.fontSize = Math.round(scale * 4);
            button.text.position = {x: x + button.bg.width / 2, y: y};

            button.text.text = "$" + item.price;
            return;
        }
        const buyButtonBg = new Sprite({texture: buyBgRedTexture, position: {x: x, y: y}, scale: scale, anchor: {x: 0, y: 0.5}, eventMode: "static"});
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
        updateButtonColor(itemID);
    }

    const hearts = [];
    function drawHearts(x, y, amount, maxAmount) {
        for (const sprite of hearts) {
            container.removeChild(sprite);
            sprite.destroy();
        }

        for (let i = 1; i <= maxAmount; i++) {
            const heartSprite = new Sprite({
                texture: heartTexture,
                anchor: 0.5,
                position: {
                    x: x + spacing*0.25 * i,
                    y: y
                },
                scale: scale*0.8
            });

            if (i > amount) {
                heartSprite.alpha = 0.2;
            }
            else heartSprite.alpha = 1;

            hearts.push(heartSprite);
            container.addChild(heartSprite);
        }
    }

    window.addEventListener("resize", reSize);
    function reSize() {
        scale = ((app.screen.width / 2560) * 0.7 + (app.screen.height / 1440) * 0.3)*8;
        spacing = scale*24;

        container.position = {x: app.screen.width/2, y: app.screen.height/2};
        shopContainer.x = app.screen.width/2-shopContainer.width/2-spacing/4;

        centerText.style.fontSize = Math.round(scale * 7);
        centerText.position = {x: 0, y: 0};

        shopBgSprite.scale = scale;
        shopBgSprite.position = {x: 0, y: 0};
        keyZSprite.scale = scale/6;
        keyZSprite.position = {x: 0, y: -app.screen.height / 4};
        keyXSprite.scale = scale/6;
        keyXSprite.position = {x: 0, y: app.screen.height/4};
        keyX2Sprite.scale = scale/6;
        keyX2Sprite.position = {x: centerText.x-centerText.width/2-spacing*0.2, y: centerText.y};
        keyVSprite.scale = scale/8;
        keyVSprite.position = {x: 0, y: app.screen.height/2 - spacing/3};
        keyCSprite.scale = scale/8;
        keyCSprite.position = {x: 0, y: app.screen.height/2 - spacing/3};

        playerSprite.scale = scale/1.6;
        playerSprite.position = {x: -app.screen.width/2 + spacing/6, y: app.screen.height/2 - spacing/6};
        dealerSprite.scale = scale/1.6;
        dealerSprite.position = {x: -app.screen.width/2 + spacing/6, y: -app.screen.height/2 + spacing/6};

        cardEmptySprite1.position = {x: -spacing/2, y: app.screen.height/4};
        cardBackSprite.scale = scale;
        cardBackSprite.position = {x: -(dealer.deck.length - 1) * spacing / 2, y: -app.screen.height / 4};
        cardEmptySprite2.position = {x: spacing/2, y: app.screen.height/4};
        cardEmptySprite1.scale = scale;
        cardEmptySprite2.scale = scale;
        
        shopSprite.scale = scale/1.6
        shopSprite.position = {x: app.screen.width/2 - spacing/6, y: -app.screen.height/2 + spacing/6};
        shopContainer.y = shopBgSprite.height/2 + shopSprite.y + shopSprite.height + scale;

        backcard3Sprite.scale = scale;
        backcard3Sprite.position = {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing/2};
        profitSprite.scale = scale;
        profitSprite.position = {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*2};

        profitGoldSprite.scale = scale;
        profitGoldSprite.position = {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*3.5};

        endSprite.scale = scale;
        endSprite.position = {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*5};

        endVisSprite.scale = scale;
        endVisSprite.position = {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 + spacing*5};

        playerSumText.style.fontSize = Math.round(scale * 8);
        playerSumText.position = {x: 0, y: app.screen.height/4 + spacing};

        dealerSumText.style.fontSize = Math.round(scale * 8);
        dealerSumText.position = {x: 0, y: -app.screen.height/4 + spacing};

        playerBalanceText.style.fontSize = Math.round(scale * 6);
        playerBalanceText.position = {x: -app.screen.width/2 + spacing*1.1, y: app.screen.height/2 - spacing/1.3};

        playerBetText.style.fontSize = Math.round(scale * 6);
        playerBetText.position = {x: -app.screen.width/2 + spacing*1.1, y: app.screen.height/2 - spacing/2};
        
        playerNameText.style.fontSize = Math.round(scale * 5);
        playerNameText.position = {x: -app.screen.width/2 + spacing*1.12, y: app.screen.height/2 - spacing};

        dealerNameText.style.fontSize = Math.round(scale * 5);
        dealerNameText.position = {x: -app.screen.width/2 + spacing*1.12, y: -app.screen.height/2 + spacing/6};

        shopText.style.fontSize = Math.round(scale * 6);
        shopText.position = {x: -shopBgSprite.width/2 + spacing/2, y: -shopBgSprite.height/2 - spacing/4};

        backcard3Text.style.fontSize = Math.round(scale * 4);
        backcard3Text.position = {x: backcard3Sprite.x + spacing/2, y: backcard3Sprite.y};

        profitText.style.fontSize = Math.round(scale * 4);
        profitText.position = {x: profitSprite.x + spacing/2, y: profitSprite.y};

        profitGoldText.style.fontSize = Math.round(scale*4);
        profitGoldText.position = {x: profitGoldSprite.x + spacing/2, y: profitGoldSprite.y};

        endText.style.fontSize = Math.round(scale*4);
        endText.position = {x: endSprite.x + spacing/2, y: endSprite.y};

        deckCountText.style.fontSize = Math.round(scale * 4);
        deckCountText.position = {x: 0, y: spacing};

        
        player.deck.forEach((card, i) => {
            card.sprite.scale = scale;
            card.sprite.position = {x: -(player.deck.length - 1) * spacing / 2 + i * spacing, y: app.screen.height / 4};
        });

        dealer.deck.forEach((card, i) => {
            card.sprite.scale.set(scale);
            card.sprite.position = {x: -(dealer.deck.length - 1) * spacing / 2 + i * spacing, y: -app.screen.height / 4};
        });
        keyVSprite.x = playerBetText.x + playerBetText.width + spacing/4;
        keyCSprite.x = playerBetText.x + playerBetText.width + spacing/1.8;
        keyXSprite.x = player.deck.length * spacing/1.4;
        keyZSprite.x = dealer.deck.length * spacing/1.4;

        drawAmountBits(ITEMS.profit.x, ITEMS.profit.y, player.inventory.profit, ITEMS.profit.maxAmount, "profit");
        drawAmountBits(ITEMS.backcard3.x, ITEMS.backcard3.y, player.inventory.backcard3, ITEMS.backcard3.maxAmount, "backcard3");
        drawAmountBits(ITEMS.profitGold.x, ITEMS.profitGold.y, player.inventory.profitGold, ITEMS.profitGold.maxAmount, "profitGold");
        drawBuyButton(profitSprite.x-backcard3Sprite.width/2, profitSprite.y+profitSprite.height-scale*2, "profit");
        drawBuyButton(backcard3Sprite.x-backcard3Sprite.width/2, backcard3Sprite.y+backcard3Sprite.height-scale*2, "backcard3");
        drawBuyButton(profitGoldSprite.x-profitGoldSprite.width/2, profitGoldSprite.y+profitGoldSprite.height-scale*2, "profitGold");
        drawBuyButton(endSprite.x-endSprite.width/2, endSprite.y+endSprite.height-scale*2, "kill");
        if (player.endgame) buyButtons["kill"].text.text = "$" + ITEMS.kill.price;
        else if (!player.endgame) buyButtons["kill"].text.text = "?";

        if (player.inventory.kill > 0 && player.endgame != 2) drawHearts(-app.screen.width/2 + spacing, -app.screen.height/2 + spacing*0.8, dealer.hp, 3);
    }

    // Game logic
    let backcardRounds = 0;

    function updateKeys() {
        keyVSprite.x = playerBetText.x + playerBetText.width + spacing/4;
        keyCSprite.x = playerBetText.x + playerBetText.width + spacing/1.8;
        keyXSprite.x = player.deck.length * spacing/1.4;
        keyZSprite.x = dealer.deck.length * spacing/1.4;
    }

    document.addEventListener("keydown", (event) => {
        if (event.key ==  "x") {
            if (gamestate === "LOOP") {
                keyXSprite.alpha = 0.4;
                gamestate = "HIT";
            }
            else if (gamestate === "BET") {
                keyXSprite.alpha = 0.4;
                gamestate = "START";
            }
            else if (gamestate === "MENU_WAIT") {
                keyX2Sprite.alpha = 0.4;
                gamestate = "RESET";
            }
        }
        if (event.key ==  "z" && gamestate === "LOOP") {
            if (container.getChildByLabel("shopBg")) return;
            gamestate = "PREHOLD";
            keyZSprite.alpha = 0.4;
        }
        if (event.key === "w" && gamestate === "BET") {
            const increment = player.betDefault;
            const nextBet = (Math.floor(player.bet / increment) + 1) * increment;

            if (nextBet <= player.balance) {
                player.bet = nextBet;
            }

            keyVSprite.alpha = 0.4;
            playerBetText.text = "BET $" + player.bet;
            updateKeys();
        }

        if (event.key === "s" && gamestate === "BET") {
            const increment = player.betDefault;
            const nextBet = (Math.ceil(player.bet / increment) - 1) * increment;

            player.bet = Math.max(Math.min(increment, player.balance), nextBet);

            keyCSprite.alpha = 0.4;
            playerBetText.text = "BET $" + player.bet;
            updateKeys();
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

            reSize();
        }
    }
    function drawDealerBackCard() {
        cardBackSprite.scale.set(scale);
        container.addChild(cardBackSprite);
        cardBackSprite.x = -(dealer.deck.length - 1) * spacing / 2;
        cardBackSprite.y = -app.screen.height / 4;
        cardBackSprite.alpha = 1;

        reSize();
    }
    let deckCards = [];
        function drawDeckCards(x, y) {
        for (const card of deckCards) {
            if (table.deck.includes(card)) {
                container.removeChild(card.sprite);
            }
        }

        deckCards.length = 0;

        const rows = 4;
        const cardsPerRow = Math.ceil(table.deck.length / rows);
        const totalRows = Math.ceil(table.deck.length / cardsPerRow);
        const rowSpacing = spacing * 0.8;
        const startY = y - (totalRows - 1) * rowSpacing / 2;

        for (let i = 0; i < table.deck.length; i++) {
            const card = table.deck[i];

            container.addChild(card.sprite);
            deckCards.push(card);

            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;

            const cardsInRow = Math.min(
                cardsPerRow,
                table.deck.length - row * cardsPerRow
            );

            card.sprite.x =
                x - (cardsInRow - 1) * spacing / 4 + col * spacing / 2;

            card.sprite.y = startY + row * rowSpacing;
            card.sprite.scale.set(scale / 2);
        }

        updateKeys();
        reSize();
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

                if (player.balance <= 0) {
                    localStorage.setItem(`${player.name}.save`, 0);
                    centerText.text = "It's so over..\nstart a new game?";
                    player.Reset();
                }
                else if (parseInt(localStorage.getItem(`${player.name}.save`)) == 1) {
                    player.LoadData();
                    centerText.text = "Continue Ventti";
                }
                else centerText.text = "Start a new Ventti";
                keyX2Sprite.position = {x: centerText.x-centerText.width/2-spacing/3, y: centerText.y};
                container.addChild(centerText, keyX2Sprite);

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
                if (table.deck.length <= 4) table.GenerateDeck();
                for (const card of player.deck) {
                    container.removeChild(card.sprite);
                }
                for (const card of dealer.deck) {
                    container.removeChild(card.sprite);
                }
                for (const card of deckCards) {
                    if (table.deck.includes(card)) {
                        container.removeChild(card.sprite);
                    }
                }
                deckCards.length = 0;

                centerText.text = "Take two cards <--";
                keyX2Sprite.position = {x: centerText.x-centerText.width/2-spacing/3, y: centerText.y};
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

                if ((player.balance >= 25000 && player.endgame == 0) || (player.endgame >= 1)) {
                    if (player.endgame != 2) player.endgame = 1;
                    endVisSprite.alpha = 1;
                    endSprite.alpha = 0;
                    endText.text = "Kill\nEnd dealer's life";
                }
                if (player.inventory.kill > 0 && player.endgame != 2) drawHearts(-app.screen.width/2 + spacing, -app.screen.height/2 + spacing*0.8, dealer.hp, 3);

                gamestate = "BET";

                player.SaveData();
                dealer.SaveData();

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
                if (player.endgame == 2) {
                    drawDeckCards(0, spacing/2);
                    if (hearts.length != 0) {
                        for (let heart of hearts) container.removeChild(heart);
                    }
                }
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
                    backcardRounds++;
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
                    if (backcardRounds > 2) player.inventory.backcard3--;
                    drawAmountBits(ITEMS.backcard3.x, ITEMS.backcard3.y, player.inventory.backcard3, ITEMS.backcard3.maxAmount, "backcard3");

                    dealerSumText.text = dealer.GetDeckSum();

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
                if (table.deck.length < 1) table.GenerateDeck();
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
                    if (table.deck.length < 1) table.GenerateDeck();
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
                player.balance = Math.round(player.balance + player.bet + (player.bet*player.inventory.profit)*0.05 + (player.bet*player.inventory.profitGold)*0.12);
                if (player.inventory.kill > 0 && player.endgame != 2) {
                    dealer.hp -= 1;
                    drawHearts(-app.screen.width/2 + spacing, -app.screen.height/2 + spacing*0.8, dealer.hp, 3);
                    if (dealer.hp <= 0) {
                        gamestate = "MERCY";
                        break;
                    }
                }

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
            case "MERCY":
                centerText.text = "Turns out\nthe dealer is so evil,\nhe is practically immortal.\n\nNow you will become the cheater."   
                container.addChild(centerText); 
                player.endgame = 2;

                sleep = 6000;
                waiting = true;

                gamestate = "RESET";

                break;
  
            default:
                break;
        }
    })
})();
