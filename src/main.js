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
    container.addChild(playerSumText);
    playerSumText.x = -app.screen.width / 2 + 32;
    playerSumText.y = -app.screen.height / 2 + 32;

    // Game logic
    let gamestate = 1;

    const table = new Table();
    table.GenerateDeck();
    for (let i = 0; i < 52; i++) {
        const texture = await Assets.load(`/assets/card${i+1}.png`);
        texture.source.scaleMode = "nearest";
        const sprite = new Sprite(texture);
        table.deck[i].sprite = sprite;
    }

    let player = new Player("Player", table);
    let dealer = new Player("Dealer", table);

    let f = 3;
    container.addChild(table.deck[f].sprite);
    table.deck[f].sprite.x = 400;
    table.deck[f].sprite.scale = 4;
    playerSumText.text = table.deck[f].value;
    console.log(table.deck[f].value)

    app.ticker.add((ticker) => {


        switch (gamestate) {
            case 1: // START, take 2 cards
                dealer.Hit();
                dealer.Hit();
                player.Hit();
                player.Hit();

                playerSumText.text = player.GetDeckSum();

                for (let i = 0; i < player.deck.length; i++) {
                    const card = player.deck[i];

                    container.addChild(card.sprite);
                    card.sprite.scale.set(2);
                    card.sprite.x = i*100;
                    
                    console.log(card.value);
                }
                
                

                gamestate = 4;
                break;
        
            default:
                break;
        }
    })
})();
