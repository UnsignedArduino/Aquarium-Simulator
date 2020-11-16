namespace SpriteKind {
    export const Thing = SpriteKind.create()
    export const Pointer = SpriteKind.create()
}
namespace StrProp {
    export const name = StrProp.create()
}
namespace ImageProp {
    export const selected_image = ImageProp.create()
    export const regular_image = ImageProp.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    sprite_cursor.setImage(img`
        2 . . . . . . . . . 
        f f . . . . . . . . 
        f e f . . . . . . . 
        f e e f . . . . . . 
        f e e e f . . . . . 
        f e e e e f . . . . 
        f e e e e e f . . . 
        f e e e e e e f . . 
        f e e e e e e e f . 
        f e e f e f f f f f 
        f e f f e f . . . . 
        f f . . f e f . . . 
        f . . . f e f . . . 
        . . . . . f e f . . 
        . . . . . f e f . . 
        . . . . . . f . . . 
        `)
    // If we have actually overlapped a thing
    if (last_overlapped_thing) {
        selected_thing = !(selected_thing)
    }
    // If we have selected a thing and have overlapped something
    if (selected_thing && last_overlapped_thing) {
        last_selected_thing = last_overlapped_thing
    }
})
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    sprite_cursor.setImage(img`
        2 . . . . . . . . . 
        f f . . . . . . . . 
        f 1 f . . . . . . . 
        f 1 1 f . . . . . . 
        f 1 1 1 f . . . . . 
        f 1 1 1 1 f . . . . 
        f 1 1 1 1 1 f . . . 
        f 1 1 1 1 1 1 f . . 
        f 1 1 1 1 1 1 1 f . 
        f 1 1 f 1 f f f f f 
        f 1 f f 1 f . . . . 
        f f . . f 1 f . . . 
        f . . . f 1 f . . . 
        . . . . . f 1 f . . 
        . . . . . f 1 f . . 
        . . . . . . f . . . 
        `)
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (selected_thing) {
        // Open menu for thing
    } else {
        // You clicked on background
        blockMenu.showMenu(["Cancel", "Add a thing...", "Clear everything"], MenuStyle.List, MenuLocation.FullScreen)
        wait_for_menu_select()
        blockMenu.closeMenu()
        if (blockMenu.selectedMenuIndex() == 0) {
            // Do nothing
        } else if (blockMenu.selectedMenuIndex() == 1) {
            // Add a thing
            game.showLongText("Please select a thing to add!", DialogLayout.Bottom)
            blockMenu.showMenu(shop_list_names, MenuStyle.List, MenuLocation.FullScreen)
            wait_for_menu_select()
            blockMenu.closeMenu()
            if (blockMenu.selectedMenuOption() == "Cancel") {
                return
            }
            let regular_image: Image = blockObject.getImageProperty(shop_list[blockMenu.selectedMenuIndex() - 1], ImageProp.regular_image)
            let selected_image: Image = blockObject.getImageProperty(shop_list[blockMenu.selectedMenuIndex() - 1], ImageProp.selected_image)
        summon_thing(sprite_cursor_pointer.x, sprite_cursor_pointer.y, regular_image, selected_image)
        } else if (blockMenu.selectedMenuIndex() == 2) {
            // Ask to clear everything
            if (game.ask("Are you sure you want", "to clear everything?") && game.ask("Are you REALLY SURE?", "You can't go back!")) {
                for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
                    sprite.destroy(effects.fountain, 100)
                }
            }
        }
    }
})
blockMenu.onMenuOptionSelected(function (option, index) {
    selected_menu_option = true
})
sprites.onOverlap(SpriteKind.Pointer, SpriteKind.Thing, function (sprite, otherSprite) {
    last_overlapped_thing = otherSprite
})
function wait_for_menu_select () {
    selected_menu_option = false
    controller.moveSprite(sprite_cursor, 0, 0)
    while (!selected_menu_option) {
        pause(100)
    }
    controller.moveSprite(sprite_cursor, 100, 100)
}
function define_thing (name: string, regular_image: Image, selected_image: Image) {
    let thing_object: blockObject.BlockObject = blockObject.create()
    blockObject.setStringProperty(thing_object, StrProp.name, name)
    blockObject.setImageProperty(thing_object, ImageProp.regular_image, regular_image)
    blockObject.setImageProperty(thing_object, ImageProp.selected_image, selected_image)
    shop_list_names.push(name)
    return thing_object
}
function summon_thing (x: number, y: number, regular_image: Image, selected_image: Image) {
    // Sumon the thing
    let sprite_thing: Sprite = sprites.create(regular_image, SpriteKind.Thing)
    sprite_thing.setPosition(x, y)
    sprites.setDataImage(sprite_thing, "regular_image", regular_image)
    sprites.setDataImage(sprite_thing, "selected_image", selected_image)
}
let last_selected_thing: Sprite = null
let last_overlapped_thing: Sprite = null
let sprite_cursor: Sprite = sprites.create(img`
    2 . . . . . . . . . 
    f f . . . . . . . . 
    f 1 f . . . . . . . 
    f 1 1 f . . . . . . 
    f 1 1 1 f . . . . . 
    f 1 1 1 1 f . . . . 
    f 1 1 1 1 1 f . . . 
    f 1 1 1 1 1 1 f . . 
    f 1 1 1 1 1 1 1 f . 
    f 1 1 f 1 f f f f f 
    f 1 f f 1 f . . . . 
    f f . . f 1 f . . . 
    f . . . f 1 f . . . 
    . . . . . f 1 f . . 
    . . . . . f 1 f . . 
    . . . . . . f . . . 
    `, SpriteKind.Player)
controller.moveSprite(sprite_cursor, 100, 100)
let sprite_cursor_pointer = sprites.create(img`
    f 
    `, SpriteKind.Pointer)
let selected_thing: boolean = false
let selected_menu_option: boolean = false
let shop_list_names: string[] = ["Cancel"]
let shop_list: blockObject.BlockObject[] = [
    define_thing("Small Rock", img`
        . . c c c c . . 
        . c b d d d c . 
        c b d d d d d c 
        c b b d d d d c 
        c b d b d d b c 
        c c b d b b b c 
        c c c b d d b c 
        c c b b c c c c 
        `, img`
        . . 5 5 5 5 5 5 . . 
        . 5 5 c c c c 5 5 . 
        5 5 c b d d d c 5 5 
        5 c b d d d d d c 5 
        5 c b b d d d d c 5 
        5 c b d b d d b c 5 
        5 c c b d b b b c 5 
        5 c c c b d d b c 5 
        5 c c b b c c c c 5 
        5 5 5 5 5 5 5 5 5 5 
        `),
    define_thing("Medium Rock", img`
        . . . . . . . . b b b b b . . . 
        . . . . . . b b d d d d b b . . 
        . . . . . b d d d d d d d c . . 
        . . . . c d d d d d d d d c . . 
        . . . c b d d d d d d d b c c . 
        . . . c b b d d d d b c c c c . 
        . . c c d b b b c c c c c c c . 
        . . c c c d d d d c c d d d c c 
        . c d b c c b b c c d d d d d c 
        . c b d d b b b c c d d d d d c 
        . c c b b b b c b c b d d d b c 
        c b b c c c c c b b b b b c c c 
        c c b b c c c c c d d d d d b c 
        c c c c c c b b b b b c c c c c 
        c c c c c c c b b b b b c c c c 
        c c c c c c c c b b b b b c c c 
        `, img`
        ........5555555...
        ......555bbbbb55..
        .....55bbddddbb5..
        ....55bdddddddc5..
        ...55cddddddddc55.
        ...5cbdddddddbcc5.
        ..55cbbddddbcccc5.
        ..5ccdbbbccccccc55
        .55cccddddccdddcc5
        .5cdbccbbccdddddc5
        .5cbddbbbccdddddc5
        55ccbbbbcbcbdddbc5
        5cbbcccccbbbbbccc5
        5ccbbcccccdddddbc5
        5ccccccbbbbbccccc5
        5cccccccbbbbbcccc5
        5ccccccccbbbbbccc5
        555555555555555555
        `),
    define_thing("Big Rock", img`
        ......ccccc.............
        ....bb33bbbcc3..........
        ...bbd33d3b333..........
        ..bdddb33d3333c.........
        .bddddb333333cbc........
        .bddbb333333dcbc........
        bddb333333333dbc........
        bddb33333333333cccb.....
        cdddddbb333cc33bdddbc...
        cdddddd333cbbbbdddddcc..
        cbddddd33bbbbbddddddccc.
        cbbbddb33cbbbcdddddcbbcc
        .cbbbbbbcbbbccbdddcbbccc
        .cccbbbbbbbccccbbbbbcccc
        `, img`
        ......5555555.............
        ....555ccccc5555..........
        ...55bb33bbbcc35..........
        ..55bbd33d3b33355.........
        .55bdddb33d3333c55........
        .5bddddb333333cbc5........
        55bddbb333333dcbc5........
        5bddb333333333dbc5555.....
        5bddb33333333333cccb555...
        5cdddddbb333cc33bdddbc55..
        5cdddddd333cbbbbdddddcc55.
        5cbddddd33bbbbbddddddccc55
        5cbbbddb33cbbbcdddddcbbcc5
        55cbbbbbbcbbbccbdddcbbccc5
        .5cccbbbbbbbccccbbbbbcccc5
        .5555555555555555555555555
        `),
    define_thing("Small Kelp", img`
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        .....88.........
        .....868........
        ......868.......
        .......868......
        .......866......
        .......8676.....
        ......67656.....
        .....656758.....
        ....65775868....
        ....65656868....
        ....87678868....
        ....87678668....
        ....87677668....
        ....8776768.....
        .....87678......
        ......8768......
        `, img`
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ....5555........
        ....58855.......
        ....586855......
        ....5586855.....
        .....558685.....
        ......586655....
        .....5586765....
        ....55676565....
        ...5565675855...
        ...5657758685...
        ...5656568685...
        ...5876788685...
        ...5876786685...
        ...5876776685...
        ...5877676855...
        ...558767855....
        ....5587685.....
        .....555555.....
        `),
    define_thing("Medium Kelp", img`
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        .........888....
        .......88668....
        ......86688.....
        .....8768.......
        ....8778........
        ....8778........
        ...8778.........
        ...8578.........
        ...8558.........
        ...8758......88.
        ...87678....878.
        ...87678...878..
        ....87678.8768..
        ....876768678...
        .....87668778...
        ......8668766...
        .......8687678..
        ........8667678.
        ........8685756.
        ....88..86665756
        ...868..86685656
        ..8668..86687678
        .8668..868687678
        .868..8688667678
        8768.88886876778
        8768.8888877678.
        876688888676778.
        87676888668778..
        .876776868668...
        .87766778868....
        ..877667688.....
        ...86767788.....
        `, img`
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        .........55555....
        .......5558885....
        ......55886685....
        .....558668855....
        ....558768555.....
        ....5877855.......
        ...5587785........
        ...5877855........
        ...585785.........
        ...585585....5555.
        ...5875855..55885.
        ...5876785.558785.
        ...58767855587855.
        ...5587678587685..
        ....587676867855..
        ....55876687785...
        .....55866876655..
        ......55868767855.
        .......5586676785.
        ....55555868575655
        ...558855866657565
        ..5586855866856565
        .55866855866876785
        .58668558686876785
        558685586886676785
        587685888868767785
        587685888887767855
        58766888886767785.
        58767688866877855.
        5587677686866855..
        .58776677886855...
        .5587766768855....
        ..55867677885.....
        ...5555555555.....
        `),
    define_thing("Big Kelp", img`
        ....88..........
        ....868.........
        .....868........
        ......868.......
        .......868......
        .......868......
        ........868.....
        ........868.....
        ........8668....
        ........8668....
        ........8668....
        ........8768....
        ........8768....
        .......86768....
        .......87768....
        .......6778.....
        ......67676.....
        ......67676.....
        .....65656......
        ....655656......
        ....65656.......
        ...876756.......
        ..876776...8....
        ..67678....8....
        .876668...88....
        .67868....86....
        .86868...876....
        868668..8768....
        86868..87678....
        86868..8766.....
        86868.87678.....
        86878.8766......
        8787887678......
        876768768.88....
        876778668.678...
        876676668..678..
        .676778668..678.
        .8766778668.6778
        .877667688885678
        ..87667768885656
        ..86766778887856
        ...8776677876876
        ....877667768668
        .....87766768668
        ......877677668.
        .......87667668.
        ........876768..
        ........87688...
        `, img`
        ....5555..........
        ....58855.........
        ....586855........
        ....5586855.......
        .....5586855......
        ......558685......
        .......586855.....
        .......558685.....
        ........586855....
        ........586685....
        ........586685....
        ........586685....
        ........587685....
        .......5587685....
        .......5867685....
        .......5877685....
        ......55677855....
        ......5676765.....
        .....55676765.....
        ....556565655.....
        ....56556565......
        ...556565655......
        ..558767565555....
        ..587677655585....
        .5567678555585....
        .58766685.5885....
        .5678685555865....
        55868685558765....
        58686685587685....
        58686855876785....
        58686855876655....
        5868685876785.....
        5868785876655.....
        58787887678555....
        587676876858855...
        5876778668567855..
        58766766685567855.
        556767786685567855
        .58766778668567785
        .58776676888856785
        .55876677688856565
        ..5867667788878565
        ..5587766778768765
        ...558776677686685
        ....55877667686685
        .....5587767766855
        ......55876676685.
        .......5587676855.
        ........58768855..
        ........5555555...
        `)
]
blockMenu.setColors(1, 15)
scene.setBackgroundColor(9)
tiles.setTilemap(tilemap`level`)
tiles.placeOnTile(sprite_cursor, tiles.getTileLocation(3, 3))
scene.cameraFollowSprite(sprite_cursor)
// The sprite cursor pointer is the thing we use for overlaps
game.onUpdate(function () {
    sprite_cursor_pointer.top = sprite_cursor.top
    sprite_cursor_pointer.left = sprite_cursor.left
})
