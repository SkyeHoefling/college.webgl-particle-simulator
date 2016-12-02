var game;
var worldLocation = "Models/island_under_falls/island_under_falls.dae";
var particleLocation = "Models/metal_sphere.dae";
c3dl.addModel(worldLocation);
c3dl.addModel(particleLocation);
function startScene() {
    game = new GameController("worldDemo", worldLocation);
    game.canvasMain();
}