namespace SpriteKind {
    export const TileCover = SpriteKind.create()
    export const Log = SpriteKind.create()
    export const RedLight = SpriteKind.create()
    export const Title = SpriteKind.create()
    export const Coin = SpriteKind.create()
}
function make_lilypad_water_lane () {
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
        if (Math.percentChance(50)) {
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
    if (Math.percentChance(20)) {
        make_railway_lane()
        last_lane = "railway"
    } else if (Math.percentChance(25)) {
        make_waterway_lanes()
        last_lane = "waterway"
    } else if (Math.percentChance(33) && last_lane != "lilypad") {
        make_lilypad_water_lane()
        last_lane = "lilypad"
    } else if (Math.percentChance(50)) {
        make_grass_lane()
        last_lane = "grass"
    } else {
        make_road_lane()
        last_lane = "road"
    }
    if (Math.percentChance(20)) {
        random_col = randint(0, tiles.tilemapColumns() - 1)
        if (tiles.tileAtLocationEquals(tiles.getTileLocation(random_col, 0), assets.tile`grass`)) {
            make_coin(random_col, 0)
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    info.changeScoreBy(1)
    otherSprite.setImage(assets.image`plus_1`)
    otherSprite.vy = -50
    otherSprite.lifespan = 100
})
function delete_all_cover_tiles () {
    for (let sprite of sprites.allOfKind(SpriteKind.TileCover)) {
        sprite.destroy()
    }
}
function reset_high_score () {
    blockSettings.remove("high-score")
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
scene.onOverlapTile(SpriteKind.Player, assets.tile`water`, function (sprite, location) {
    timer.throttle("check_in_water", 50, function () {
        timer.after(50, function () {
            if (sprite.tileKindAt(TileDirection.Center, assets.tile`water`) && !(is_overlapping_kind(sprite, SpriteKind.Log))) {
                sprite.destroy(effects.fountain, 100)
            }
        })
    })
})
function update_high_score (new_score: number) {
    if (new_score > info.highScore()) {
        blockSettings.writeNumber("high-score", new_score)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingLeft), character.rule(Predicate.FacingLeft, Predicate.NotMoving))
        last_move_time = game.runtime()
    }
})
function fade_out (delay: number, block: boolean) {
    color.startFade(color.Black, color.originalPalette, delay)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function make_coin (col: number, row: number) {
    sprite_coin = sprites.create(assets.image`coin`, SpriteKind.Coin)
    tiles.placeOnTile(sprite_coin, tiles.getTileLocation(col, row))
    sprite_coin.setFlag(SpriteFlag.GhostThroughWalls, true)
}
function game_over () {
    timer.after(2000, function () {
        game.over(false)
    })
}
function fade_in (delay: number, block: boolean) {
    color.startFade(color.originalPalette, color.Black, delay)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
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
        last_move_time = game.runtime()
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
    [assets.image`back_chicken`],
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
                sprite_player.vy = tiles.tileWidth() * -1 * chicken_speed * 0.9
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
        last_move_time = game.runtime()
    }
})
function make_waterway_lanes () {
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
        tiles.setTileAt(tiles.getTileLocation(col, 0), assets.tile`water`)
    }
    if (Math.percentChance(50)) {
        tiles.setTileAt(tiles.getTileLocation(0, 0), assets.tile`water_right`)
    } else {
        tiles.setTileAt(tiles.getTileLocation(tiles.tilemapColumns() - 1, 0), assets.tile`water_left`)
    }
}
function move_sprites_down () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        sprite.y += tiles.tileWidth()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Enemy)) {
        sprite.y += tiles.tileWidth()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Log)) {
        sprite.y += tiles.tileWidth()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.RedLight)) {
        sprite.y += tiles.tileWidth()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Coin)) {
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
    cover_tiles(assets.tile`water_right`, assets.tile`water`)
    cover_tiles(assets.tile`water_left`, assets.tile`water`)
    cover_tiles(assets.tile`railway_right`, assets.tile`railway`)
}
function is_overlapping_kind (target: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            return true
        }
    }
    return false
}
function make_railway_lane () {
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setWallAt(tiles.getTileLocation(col, 0), false)
        tiles.setTileAt(tiles.getTileLocation(col, 0), assets.tile`railway`)
    }
    tiles.setTileAt(tiles.getTileLocation(0, 0), assets.tile`railway_right`)
    sprite_red_light = sprites.create(assets.image`red_light`, SpriteKind.RedLight)
    tiles.placeOnTile(sprite_red_light, tiles.getTileLocation(0, 0))
    sprite_red_light.z = 3
    sprites.setDataNumber(sprite_red_light, "last_train_time", game.runtime())
}
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    in_game = false
    timer.background(function () {
        game_over()
    })
})
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
    sprite_player.z = 1
    animate_chicken()
    tiles.placeOnRandomTile(sprite_player, assets.tile`start`)
    tiles.setTileAt(tiles.locationOfSprite(sprite_player), assets.tile`grass`)
    scene.cameraFollowSprite(sprite_player)
}
function sprite_kind_overlapped (target: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            return sprite
        }
    }
    return [][0]
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (otherSprite == sprite_eagle) {
        sprite.setFlag(SpriteFlag.Ghost, true)
        otherSprite.setFlag(SpriteFlag.Ghost, true)
        sprite.setFlag(SpriteFlag.AutoDestroy, true)
        sprite.vy = otherSprite.vy
        sprite.y += -8
    } else {
        sprite.destroy(effects.spray, 100)
    }
})
let sprite_log: Sprite = null
let sprite_car: Sprite = null
let sprite_train: Sprite = null
let sprite_light: Sprite = null
let sprite_eagle: Sprite = null
let row_invert = 0
let sprite_red_light: Sprite = null
let chicken_speed = 0
let sprite_coin: Sprite = null
let sprite_tile_cover: Sprite = null
let random_col = 0
let last_lane = ""
let last_move_time = 0
let in_game = false
let sprite_player: Sprite = null
color.setPalette(
color.Black
)
scene.setBackgroundColor(7)
tiles.setTilemap(tilemap`map`)
tile_map_cover_tiles()
make_chicken()
sprite_player.y += 8
let sprite_intro = sprites.create(assets.image`title_screen`, SpriteKind.Title)
sprite_intro.top = 25
sprite_intro.left = 0
sprite_intro.z = 5
sprite_intro.setFlag(SpriteFlag.Ghost, true)
let sprite_play_button = sprites.create(assets.image`play_button`, SpriteKind.Title)
sprite_play_button.x = scene.screenWidth() * 0.3
sprite_play_button.bottom = scene.screenHeight() + 13
sprite_play_button.z = 5
sprite_play_button.setFlag(SpriteFlag.Ghost, true)
let sprite_settings_button = sprites.create(assets.image`settings_button`, SpriteKind.Title)
sprite_settings_button.x = scene.screenWidth() * 0.6
sprite_settings_button.bottom = scene.screenHeight() + 13
sprite_settings_button.z = 5
sprite_settings_button.setFlag(SpriteFlag.Ghost, true)
let option_selected = 0
in_game = false
fade_out(1000, false)
timer.background(function () {
    while (!(controller.A.isPressed())) {
        if (option_selected == 0) {
            sprite_play_button.setImage(assets.image`play_button_highlighted`)
            sprite_settings_button.setImage(assets.image`settings_button`)
        } else if (option_selected == 1) {
            sprite_play_button.setImage(assets.image`play_button`)
            sprite_settings_button.setImage(assets.image`settings_button_highlighted`)
        }
        if (controller.right.isPressed() && option_selected < 1) {
            option_selected += 1
        } else if (controller.left.isPressed() && option_selected > 0) {
            option_selected += -1
        }
        pause(100)
    }
    sprite_intro.ay = -500
    sprite_play_button.ax = -500
    sprite_settings_button.ax = 500
    timer.after(5000, function () {
        sprite_intro.destroy()
        sprite_play_button.destroy()
        sprite_settings_button.destroy()
    })
    if (option_selected == 0) {
        info.setScore(0)
        in_game = true
        last_move_time = game.runtime()
        last_lane = ""
    } else if (option_selected == 1) {
        game.showLongText("No settings yet!", DialogLayout.Center)
        fade_in(1000, true)
        game.reset()
    }
})
game.onUpdateInterval(1000, function () {
    if (in_game && true) {
        if (game.runtime() - last_move_time > 5000) {
            in_game = false
            if (!(sprite_eagle)) {
                timer.after(500, function () {
                    sprite_eagle = sprites.create(assets.image`eagle`, SpriteKind.Enemy)
                    sprite_eagle.setFlag(SpriteFlag.GhostThroughWalls, true)
                    sprite_eagle.x = sprite_player.x
                    sprite_eagle.bottom = 0
                    sprite_eagle.z = 2
                    sprite_eagle.vy = 200
                })
            }
        }
    }
})
forever(function () {
    if (tiles.getTilesByType(assets.tile`railway_right`).length > 0) {
        sprite_light = sprites.allOfKind(SpriteKind.RedLight)._pickRandom()
        if (game.runtime() - sprites.readDataNumber(sprite_light, "last_train_time") > 5000) {
            sprites.setDataNumber(sprite_light, "last_train_time", game.runtime())
            for (let index = 0; index < 5; index++) {
                animation.runImageAnimation(
                sprite_light,
                assets.animation`red_light_flashing`,
                200,
                false
                )
                pause(400)
            }
            sprite_light.setImage(assets.image`red_light`)
            sprite_train = sprites.create(assets.image`train`, SpriteKind.Enemy)
            if (sprite_train) {
                tiles.placeOnTile(sprite_train, tiles.getTileLocation(0, tiles.locationXY(tiles.locationOfSprite(sprite_light), tiles.XY.row)))
                sprite_train.vx = 3000
                sprite_train.right = 0
                sprite_train.z = 2
                sprite_train.setFlag(SpriteFlag.GhostThroughWalls, true)
                timer.after(250, function () {
                    sprite_train.setFlag(SpriteFlag.AutoDestroy, true)
                })
            }
        }
    }
    pause(1000)
})
forever(function () {
    while (!(is_overlapping_kind(sprite_player, SpriteKind.Log))) {
        pause(100)
    }
    sprite_player.vx = sprite_kind_overlapped(sprite_player, SpriteKind.Log).vx
    timer.after(100, function () {
        if (!(is_overlapping_kind(sprite_player, SpriteKind.Log))) {
            sprite_player.vx = 0
        }
    })
})
game.onUpdateInterval(500, function () {
    if (Math.percentChance(50)) {
        if (tiles.getTilesByType(assets.tile`road_right`).length > 0) {
            sprite_car = sprites.create([assets.image`red_right_facing_car`, assets.image`blue_right_facing_car`, assets.image`pink_right_facing_car`]._pickRandom(), SpriteKind.Enemy)
            tiles.placeOnRandomTile(sprite_car, assets.tile`road_right`)
            sprite_car.vx = 50
            sprite_car.right = 0
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
            sprite_car.left = tiles.tilemapColumns() * tiles.tileWidth()
            sprite_car.setFlag(SpriteFlag.GhostThroughWalls, true)
            timer.after(250, function () {
                sprite_car.setFlag(SpriteFlag.AutoDestroy, true)
            })
        }
    }
})
game.onUpdateInterval(500, function () {
    if (Math.percentChance(50)) {
        if (tiles.getTilesByType(assets.tile`water_right`).length > 0) {
            sprite_log = sprites.create(assets.image`log`, SpriteKind.Log)
            tiles.placeOnRandomTile(sprite_log, assets.tile`water_right`)
            sprite_log.vx = 25
            sprite_log.right = 0
            sprite_log.setFlag(SpriteFlag.GhostThroughWalls, true)
            timer.after(250, function () {
                sprite_car.setFlag(SpriteFlag.AutoDestroy, true)
            })
        }
    } else {
        if (tiles.getTilesByType(assets.tile`water_left`).length > 0) {
            sprite_log = sprites.create(assets.image`log`, SpriteKind.Log)
            tiles.placeOnRandomTile(sprite_log, assets.tile`water_left`)
            sprite_log.vx = -25
            sprite_log.left = tiles.tilemapColumns() * tiles.tileWidth()
            sprite_log.setFlag(SpriteFlag.GhostThroughWalls, true)
            timer.after(250, function () {
                sprite_log.setFlag(SpriteFlag.AutoDestroy, true)
            })
        }
    }
})
