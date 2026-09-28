import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: " #00563F", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);

  const texture = await Assets.load("/assets/card1.png");
  const testcard = new Sprite(texture);
  testcard.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(testcard);
})();
