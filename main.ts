controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingUp), character.rule(Predicate.FacingUp, Predicate.NotMoving))
    }
})
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
        })
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_chicken(character.rule(Predicate.MovingDown), character.rule(Predicate.FacingDown, Predicate.NotMoving))
    }
})
function make_chicken () {
    sprite_player = sprites.create(assets.image`back_chicken`, SpriteKind.Player)
    animate_chicken()
    tiles.placeOnRandomTile(sprite_player, assets.tile`start`)
    tiles.setTileAt(tiles.locationOfSprite(sprite_player), assets.tile`grass`)
    scene.cameraFollowSprite(sprite_player)
}
let chicken_speed = 0
let sprite_player: Sprite = null
let in_game = false
scene.setBackgroundColor(7)
tiles.setTilemap(tilemap`map`)
make_chicken()
in_game = true
