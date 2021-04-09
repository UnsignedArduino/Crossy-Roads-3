// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "map":
            case "level1":return tiles.createTilemap(hex`0a000900020501020101030101020707070707070707070a02010105010201010302090707070707070707070202050201010401020202020101010106010202020201010108010102020202010301010104020202020202020202020202`, img`
2 . . 2 . . . . . 2 
. . . . . . . . . . 
2 . . . . 2 . . . 2 
. . . . . . . . . . 
2 2 . 2 . . . . 2 2 
2 2 . . . . 2 . 2 2 
2 2 . . . . . . 2 2 
2 2 . . . . . . 2 2 
2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency16,myTiles.tile1,sprites.builtin.forestTiles0,sprites.castle.tileGrass1,sprites.castle.tileGrass3,sprites.castle.tileGrass2,sprites.castle.rock0,sprites.vehicle.roadHorizontal,myTiles.tile2,myTiles.tile3,myTiles.tile4], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "grass":
            case "tile1":return tile1;
            case "start":
            case "tile2":return tile2;
            case "road_right":
            case "tile3":return tile3;
            case "road_left":
            case "tile4":return tile4;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
