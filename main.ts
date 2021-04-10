namespace SpriteKind {
    export const TileCover = SpriteKind.create()
}
function make_lilypad_water_lane () {
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
        if (Math.percentChance(60)) {
            tiles.setTileAt(tiles.getTileLocation(col, 0), assets.tile`water`)
        } else {
            tiles.setTileAt(tiles.getTileLocation(col, 0), [assets.tile`lilypad_up`, assets.tile`lilypad_down`, assets.tile`lilypad_left`, assets.tile`lilypad_right`]._pickRandom())
        }
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingUp), character.rule(Predicate.FacingUp, Predicate.NotMoving))
        last_move_time = game.runtime()
    }
})
function make_random_obstacle () {
    if (Math.percentChance(33)) {
        make_lilypad_water_lane()
    } else if (Math.percentChance(50)) {
        make_grass_lane()
    } else {
        make_road_lane()
    }
}
function delete_all_cover_tiles () {
    for (let sprite of sprites.allOfKind(SpriteKind.TileCover)) {
        sprite.destroy()
    }
}
function make_grass_lane () {
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
    }
    tiles.setWallAt(tiles.getTileLocation(0, 0), true)
    tiles.setTileAt(tiles.getTileLocation(0, 0), sprites.builtin.forestTiles0)
    tiles.setWallAt(tiles.getTileLocation(tiles.tilemapColumns() - 1, 0), true)
    tiles.setTileAt(tiles.getTileLocation(tiles.tilemapColumns() - 1, 0), sprites.builtin.forestTiles0)
    for (let col = 0; col <= tiles.tilemapColumns() - 3; col++) {
        if (Math.percentChance(75)) {
            tiles.setTileAt(tiles.getTileLocation(col + 1, 0), assets.tile`grass`)
        } else if (Math.percentChance(50)) {
            tiles.setTileAt(tiles.getTileLocation(col + 1, 0), [sprites.castle.tileGrass1, sprites.castle.tileGrass3, sprites.castle.tileGrass2]._pickRandom())
        } else {
            tiles.setTileAt(tiles.getTileLocation(col + 1, 0), [
            sprites.builtin.forestTiles0,
            sprites.builtin.forestTiles0,
            sprites.builtin.forestTiles0,
            sprites.builtin.forestTiles0,
            sprites.castle.rock0,
            sprites.castle.rock1
            ]._pickRandom())
            tiles.setWallAt(tiles.getTileLocation(col + 1, 0), true)
        }
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
function make_road_lane () {
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
        tiles.setTileAt(tiles.getTileLocation(col, 0), sprites.vehicle.roadHorizontal)
    }
    if (Math.percentChance(50)) {
        tiles.setTileAt(tiles.getTileLocation(0, 0), assets.tile`road_right`)
    } else {
        tiles.setTileAt(tiles.getTileLocation(tiles.tilemapColumns() - 1, 0), assets.tile`road_left`)
    }
}
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
    info.changeScoreBy(1)
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    in_game = false
    if (otherSprite == sprite_eagle) {
        sprite.setFlag(SpriteFlag.Ghost, true)
        otherSprite.setFlag(SpriteFlag.Ghost, true)
        sprite.vy = otherSprite.vy
        sprite.y += -8
    } else {
        sprite.destroy(effects.spray, 100)
    }
    timer.after(2000, function () {
        game.over(false)
    })
})
let sprite_car: Sprite = null
let sprite_eagle: Sprite = null
let row_invert = 0
let chicken_speed = 0
let sprite_player: Sprite = null
let sprite_tile_cover: Sprite = null
let last_move_time = 0
let in_game = false
info.setScore(0)
scene.setBackgroundColor(7)
tiles.setTilemap(tilemap`map`)
tile_map_cover_tiles()
make_chicken()
in_game = true
last_move_time = game.runtime()
game.onUpdateInterval(1000, function () {
    if (game.runtime() - last_move_time > 5000) {
        in_game = false
        if (!(sprite_eagle)) {
            timer.after(500, function () {
                sprite_eagle = sprites.create(assets.image`eagle`, SpriteKind.Enemy)
                sprite_eagle.setFlag(SpriteFlag.GhostThroughWalls, true)
                sprite_eagle.x = sprite_player.x
                sprite_eagle.bottom = 0
                sprite_eagle.z = 1
                sprite_eagle.vy = 200
            })
        }
    }
})
game.onUpdateInterval(500, function () {
    if (Math.percentChance(50)) {
        if (tiles.getTilesByType(assets.tile`road_right`).length > 0) {
            sprite_car = sprites.create([assets.image`red_right_facing_car`, assets.image`blue_right_facing_car`, assets.image`pink_right_facing_car`]._pickRandom(), SpriteKind.Enemy)
            tiles.placeOnRandomTile(sprite_car, assets.tile`road_right`)
            sprite_car.vx = 50
            sprite_car.x += -16
            sprite_car.setFlag(SpriteFlag.GhostThroughWalls, true)
            timer.after(250, function () {
                sprite_car.setFlag(SpriteFlag.AutoDestroy, true)
            })
        }
    } else {
        if (tiles.getTilesByType(assets.tile`road_left`).length > 0) {
            sprite_car = sprites.create([assets.image`red_left_facing_car`, assets.image`blue_left_facing_car`, assets.image`pink_left_facing_car`]._pickRandom(), SpriteKind.Enemy)
            tiles.placeOnRandomTile(sprite_car, assets.tile`road_left`)
            sprite_car.vx = -50
            sprite_car.x += 16
            sprite_car.setFlag(SpriteFlag.GhostThroughWalls, true)
            timer.after(250, function () {
                sprite_car.setFlag(SpriteFlag.AutoDestroy, true)
            })
        }
    }
})
