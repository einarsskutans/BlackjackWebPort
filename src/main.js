import { Application, Assets, Sprite, Container } from "pixi.js";
import { Table } from "./blackjack";

(async () => {
     // Create a new application
     const app = new Application();

     // Initialize the application
    await app.init({ background: "#00563F", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container").appendChild(app.canvas);

    // Game logic
    const container = new Container();
    app.stage.addChild(container);

    const table = new Table();
    table.GenerateDeck();
    for (let i = 1; i < 52; i++) {
        const texture = await Assets.load(`/assets/card${i}.png`);
        const sprite = new Sprite(texture);
        table.deck[i].sprite = sprite;
    }
    
    table.deck[6].sprite.x = 0;
    table.deck[6].sprite.y = 0;
    container.addChild(table.deck[6].sprite);

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
})();
