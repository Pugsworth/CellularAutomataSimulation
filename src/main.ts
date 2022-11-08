import { Sprator } from "./sprator";
import Jimp from "jimp";
import { Grid } from "./grid";
import { exit } from "process";

const sprator = new Sprator(0, 0, 8, 8);
sprator.setSpriteCount(16);


// let sprite = sprator.generateSprite(10);
// console.log("Sprite info: %s", sprite.toString());

/*
let step = 0;
var iter = sprator.generateSpriteSteps(5);
for (let sprite of iter) {
    // console.log("Sprite info: %s", sprite.toString());

    let image = new Jimp(sprite.width, sprite.height, 0x00000000, (err: any, image: any) => {
        if (err) throw err;

        // Print the sprite to the console
        for (let cell of sprite) {
            // if (cell.data) {
            //     process.stdout.write("X");
            // } else {
            //     process.stdout.write(" ");
            // }

            // if (cell.position.x == sprite.width - 1) {
            //     process.stdout.write("\n");
            // }
            image.setPixelColor(cell.data ? 0xFFFFFFFF : 0x00000000, cell.position.x, cell.position.y);
        }

        image.scale(8, Jimp.RESIZE_NEAREST_NEIGHBOR);

        image.write(`./output/sprite_${step++}.png`);
    });
}
*/

const spriteList = sprator.generateSprites(10);
// console.log("Sprite info: %s", sprite.toString());
let id = 0;
for (const sprite of spriteList) {
    let image = new Jimp(sprite.width, sprite.height, 0x00000000, (err: any, image: any) => {
        if (err) throw err;


        for (const cell of sprite) {
            image.setPixelColor(cell.data ? 0xFFFFFFFF : 0x00000000, cell.position.x, cell.position.y);
        }

        image.scale(8, Jimp.RESIZE_NEAREST_NEIGHBOR);

        image.write(`./output/sprite_${id++}.png`);
    });
}