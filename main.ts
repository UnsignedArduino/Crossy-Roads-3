namespace SpriteKind {
    export const TileCover = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingUp), character.rule(Predicate.FacingUp, Predicate.NotMoving))
    }
})
function make_random_obstacle () {
	
}
function delete_all_cover_tiles () {
    for (let sprite of sprites.allOfKind(SpriteKind.TileCover)) {
        sprite.destroy()
    }
}
function cover_tiles (tile: Image, image2: Image) {
    for (let location of tiles.getTilesByType(tile)) {
        sprite_tile_cover = sprites.create(image2, SpriteKind.TileCover)
        tiles.placeOnTile(sprite_tile_cover, location)
        sprite_tile_cover.z = -1
        sprite_tile_cover.setFlag(SpriteFlag.Ghost, true)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingLeft), character.rule(Predicate.FacingLeft, Predicate.NotMoving))
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingRight), character.rule(Predicate.FacingRight, Predicate.NotMoving))
    }
})
function animate_chicken () {
    character.runFrames(
    sprite_player,
    [assets.image`back_chicken`],
    100,
    character.rule(Predicate.FacingUp, Predicate.NotMoving)
    )
    character.runFrames(
    sprite_player,
    assets.animation`chicken_back_hopping`,
    50,
    character.rule(Predicate.MovingUp)
    )
    character.runFrames(
    sprite_player,
    [assets.image`front_chicken`],
    100,
    character.rule(Predicate.FacingDown, Predicate.NotMoving)
    )
    character.runFrames(
    sprite_player,
    assets.animation`chicken_hopping_front`,
    50,
    character.rule(Predicate.MovingDown)
    )
    character.runFrames(
    sprite_player,
    [assets.image`right_side_chicken`],
    100,
    character.rule(Predicate.FacingLeft, Predicate.NotMoving)
    )
    character.runFrames(
    sprite_player,
    assets.animation`chicken_hopping_right`,
    50,
    character.rule(Predicate.MovingLeft)
    )
    character.runFrames(
    sprite_player,
    [assets.image`left_side_chicken`],
    100,
    character.rule(Predicate.FacingRight, Predicate.NotMoving)
    )
    character.runFrames(
    sprite_player,
    assets.animation`chicken_hopping_right0`,
    50,
    character.rule(Predicate.MovingRight)
    )
}
function move_chicken (before: number, after: number) {
    if (character.matchesRule(sprite_player, character.rule(Predicate.NotMoving))) {
        chicken_speed = 5
        timer.throttle("move_chicken", 1000 / chicken_speed, function () {
            character.setCharacterState(sprite_player, before)
            timer.after(200, function () {
                character.setCharacterState(sprite_player, character.rule(after))
            })
            if (before == character.rule(Predicate.MovingRight)) {
                sprite_player.vx = tiles.tileWidth() * chicken_speed
            } else if (before == character.rule(Predicate.MovingLeft)) {
                sprite_player.vx = tiles.tileWidth() * -1 * chicken_speed
            } else if (before == character.rule(Predicate.MovingDown)) {
                sprite_player.vy = tiles.tileWidth() * chicken_speed
            } else if (before == character.rule(Predicate.MovingUp)) {
                sprite_player.vy = tiles.tileWidth() * -1 * chicken_speed
            }
            timer.after(1000 / chicken_speed, function () {
                sprite_player.vx = 0
                sprite_player.vy = 0
                tiles.placeOnTile(sprite_player, tiles.locationOfSprite(sprite_player))
            })
            if (tiles.locationXY(tiles.locationOfSprite(sprite_player), tiles.XY.row) < 4) {
                make_new_lane()
            }
        })
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingDown), character.rule(Predicate.FacingDown, Predicate.NotMoving))
    }
})
function move_sprites_down () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        sprite.y += tiles.tileWidth()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Enemy)) {
        sprite.y += tiles.tileWidth()
    }
}
function make_new_lane () {
    delete_all_cover_tiles()
    move_sprites_down()
    move_tilemap_down()
    make_random_obstacle()
    tile_map_cover_tiles()
}
function tile_map_cover_tiles () {
    cover_tiles(assets.tile`road_right`, sprites.vehicle.roadHorizontal)
    cover_tiles(assets.tile`road_left`, sprites.vehicle.roadHorizontal)
}
function move_tilemap_down () {
    for (let row = 0; row <= tiles.tilemapRows() - 1; row++) {
        row_invert = tiles.tilemapRows() - 1 - row
        for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
            tiles.setTileAt(tiles.getTileLocation(col, row_invert), tiles.getTileAtLocation(tiles.getTileLocation(col, row_invert - 1)))
            tiles.setWallAt(tiles.getTileLocation(col, row_invert), tiles.tileIsWall(tiles.getTileLocation(col, row_invert - 1)))
        }
    }
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
    }
}
function make_chicken () {
    sprite_player = sprites.create(assets.image`back_chicken`, SpriteKind.Player)
    animate_chicken()
    tiles.placeOnRandomTile(sprite_player, assets.tile`start`)
    tiles.setTileAt(tiles.locationOfSprite(sprite_player), assets.tile`grass`)
    scene.cameraFollowSprite(sprite_player)
}
let row_invert = 0
let chicken_speed = 0
let sprite_player: Sprite = null
let sprite_tile_cover: Sprite = null
let in_game = false
scene.setBackgroundColor(7)
tiles.setTilemap(tilemap`map`)
tile_map_cover_tiles()
make_chicken()
in_game = true
