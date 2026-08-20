import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: " #00563F", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);

  //const texture = await Assets.load("/assets/bunny.png");
  //const bunny = new Sprite(texture);

  //bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  //app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    //bunny.rotation += 0.1 * time.deltaTime;
  });
})();
