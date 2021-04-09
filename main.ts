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
        character.setCharacterState(sprite_player, before)
        timer.after(200, function () {
            character.setCharacterState(sprite_player, character.rule(after))
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
}
let sprite_player: Sprite = null
let in_game = false
scene.setBackgroundColor(7)
make_chicken()
in_game = true
