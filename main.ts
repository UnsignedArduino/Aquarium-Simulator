namespace SpriteKind {
    export const Thing = SpriteKind.create()
    export const Pointer = SpriteKind.create()
}
namespace StrProp {
    export const name = StrProp.create()
}
namespace NumProp {
    export const group = NumProp.create()
    export const sub_group = NumProp.create()
    export const index = NumProp.create()
}
namespace ImageProp {
    export const selected_image = ImageProp.create()
    export const regular_image = ImageProp.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (enable_selection && !moving_something) {
        // If we have actually overlapped a thing
        if (overlapping_thing(sprite_cursor_pointer)) {
            selected_thing = true
        } else {
            selected_thing = false
        }
        // If we have overlapped something
        if (last_overlapped_thing && selected_thing) {
            last_selected_thing = last_overlapped_thing
        }
        // If we have selected something
        if (last_selected_thing && selected_thing) {
            sprite_cursor.setImage(img`
                2 . . . . . . . . .
                f f . . . . . . . .
                f 5 f . . . . . . .
                f 5 5 f . . . . . .
                f 5 5 5 f . . . . .
                f 5 5 5 5 f . . . .
                f 5 5 5 5 5 f . . .
                f 5 5 5 5 5 5 f . .
                f 5 5 5 5 5 5 5 f .
                f 5 5 f 5 f f f f f
                f 5 f f 5 f . . . .
                f f . . f 5 f . . .
                f . . . f 5 f . . .
                . . . . . f 5 f . .
                . . . . . f 5 f . .
                . . . . . . f . . .
            `)
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    // If we have selected something
    if (last_selected_thing && selected_thing) {
        sprite_cursor.setImage(img`
            2 . . . . . . . . .
            f f . . . . . . . .
            f 5 f . . . . . . .
            f 5 5 f . . . . . .
            f 5 5 5 f . . . . .
            f 5 5 5 5 f . . . .
            f 5 5 5 5 5 f . . .
            f 5 5 5 5 5 5 f . .
            f 5 5 5 5 5 5 5 f .
            f 5 5 f 5 f f f f f
            f 5 f f 5 f . . . .
            f f . . f 5 f . . .
            f . . . f 5 f . . .
            . . . . . f 5 f . .
            . . . . . f 5 f . .
            . . . . . . f . . .
        `)
    } else {
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
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (moving_something) {
        moving_something = false
        selected_thing = false
    } else {
        timer.background(function() {
            if (!menu_opened) {
                enable_selection = false
                menu_opened = true
                if (selected_thing) {
                    // Open menu for thing
                    blockMenu.showMenu(["Cancel", "Move...", "Move by", "Move to", "Set Z index", "Get attributes", "Remove"], MenuStyle.List, MenuLocation.FullScreen)
                    wait_for_menu_select()
                    blockMenu.closeMenu()
                    if (blockMenu.selectedMenuIndex() == 0) {
                        // Do nothing
                    } else if (blockMenu.selectedMenuIndex() == 1) {
                        // Have thing follow the cursor until B is pressed
                        game.showLongText("Press [B] to place the sprite down", DialogLayout.Bottom)
                        moving_something = true
                    } else if (blockMenu.selectedMenuIndex() == 2) {
                        // Move the thing by X and Y number of pixels in respective axes
                        let move_x = game.askForNumber("Enter the number of pixels to move: (X axis)", 3)
                        let move_y = game.askForNumber("Enter the number of pixels to move: (Y axis)", 3)
                        last_selected_thing.x += move_x
                        last_selected_thing.y += move_y
                        game.showLongText("Successfully moved thing!", DialogLayout.Bottom)
                    } else if (blockMenu.selectedMenuIndex() == 3) {
                        // Move the thing to X and Y cordinates
                        let set_x = game.askForNumber("Enter the X cordinate:", 3)
                        let set_y = game.askForNumber("Enter the Y cordinate:", 3)
                        last_selected_thing.x = set_x
                        last_selected_thing.y = set_y
                        game.showLongText("Successfully moved thing!", DialogLayout.Bottom)
                    } else if (blockMenu.selectedMenuIndex() == 4) {
                        // Bring number dialog up and set Z index
                        let z_index = game.askForNumber("Enter a Z index to set:", 3)
                        if (z_index == -1) {
                            game.showLongText("Canceled.", DialogLayout.Bottom)
                        } else if (z_index < 0) {
                            game.showLongText("Invalid Z index!", DialogLayout.Bottom)
                        } else {
                            last_selected_thing.z = z_index
                            game.showLongText("Successfully set Z index!", DialogLayout.Bottom)
                        }
                    } else if (blockMenu.selectedMenuIndex() == 5) {
                        // Show attributes about it
                        // Attributes shown: X, Y, Z
                        let attributes = "Attributes about: '" + sprites.readDataString(last_selected_thing, "species") + "':\n"
                        attributes += "X: " + last_selected_thing.x + "\n"
                        attributes += "Y: " + last_selected_thing.y + "\n"
                        attributes += "Z: " + last_selected_thing.z + "\n"
                        game.showLongText(attributes, DialogLayout.Full)
                    } else if (blockMenu.selectedMenuIndex() == 6) {
                        // Ask to destroy it
                        if (game.ask("Are you sure you want", "to remove this thing?")) {
                            last_selected_thing.destroy(effects.fountain, 100)
                            selected_thing = false
                        }
                    }
                } else {
                    // Nothing selected
                    blockMenu.showMenu(["Cancel", "Add a thing...", "Save aquarium", "Load aquarium", "Clear saves", "Clear everything"], MenuStyle.List, MenuLocation.FullScreen)
                    wait_for_menu_select()
                    blockMenu.closeMenu()
                    if (blockMenu.selectedMenuIndex() == 0) {
                        // Do nothing
                    } else if (blockMenu.selectedMenuIndex() == 1) {
                        // Add a thing
                        add_thing()
                    } else if (blockMenu.selectedMenuIndex() == 2) {
                        game.showLongText(
                            "Successfully saved aquarium to name: '" + save_current_aquarium(
                                game.askForString("Please input a save name:", 24)
                            ) + "'!",
                            DialogLayout.Bottom
                        )
                    } else if (blockMenu.selectedMenuIndex() == 3) {
                        if (sprites.allOfKind(SpriteKind.Thing).length > 0) {
                            if (game.ask("Are you sure you want", "to clear everything?")) {
                                for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
                                    sprite.destroy(effects.fountain, 100)
                                }
                                last_selected_thing = null
                            }
                        }
                        if (load_aquarium(game.askForString("Please input the save name:", 24))) {
                            game.showLongText("Successfully loaded aquarium!", DialogLayout.Bottom)
                        } else {
                            game.showLongText("Oh no, something happened while loading the aquarium! Please make sure you typed in the correct name!", DialogLayout.Bottom)
                        }
                    } else if (blockMenu.selectedMenuIndex() == 4) {
                        if (game.ask("Are you sure you want", "to clear all saves?") && game.ask("Are you REALLY SURE?", "You can't go back!")) {
                            blockSettings.clear()
                            game.showLongText("Successfully cleared all saves!", DialogLayout.Bottom)
                        }
                    } else if (blockMenu.selectedMenuIndex() == 5) {
                        // Ask to clear everything
                        if (sprites.allOfKind(SpriteKind.Thing).length > 0) {
                            if (game.ask("Are you sure you want", "to clear everything?") && game.ask("Are you REALLY SURE?", "You can't go back!")) {
                                for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
                                    sprite.destroy(effects.fountain, 100)
                                }
                                last_selected_thing = null
                            }
                        } else {
                            game.showLongText("Nothing to clear!", DialogLayout.Bottom)
                        }
                    }
                }
                enable_selection = true
                menu_opened = false
            }
        })
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
function define_thing (name: string, group: string, regular_image: Image, selected_image: Image) {
    if (shop_list_groups.indexOf(group) == -1) {
        shop_list_subgroups_index = 0
        shop_list_groups_index += 1
        shop_list_groups.push(group)
    }
    shop_list_subgroups.push(name)
    let thing_object: blockObject.BlockObject = blockObject.create()
    blockObject.setStringProperty(thing_object, StrProp.name, name)
    blockObject.setNumberProperty(thing_object, NumProp.group, shop_list_groups_index)
    blockObject.setNumberProperty(thing_object, NumProp.sub_group, shop_list_subgroups_index)
    blockObject.setNumberProperty(thing_object, NumProp.index, shop_list_index)
    blockObject.setImageProperty(thing_object, ImageProp.regular_image, regular_image)
    blockObject.setImageProperty(thing_object, ImageProp.selected_image, selected_image)
    shop_list_subgroups_index += 1
    shop_list_index += 1
    return thing_object
}
function summon_thing (x: number, y: number, species: string, index: number, regular_image: Image, selected_image: Image): Sprite {
    // Sumon the thing
    let sprite_thing: Sprite = sprites.create(regular_image, SpriteKind.Thing)
    sprite_thing.setPosition(x, y)
    sprites.setDataString(sprite_thing, "species", species)
    sprites.setDataNumber(sprite_thing, "index", index)
    sprites.setDataImage(sprite_thing, "regular_image", regular_image)
    sprites.setDataImage(sprite_thing, "selected_image", selected_image)
    return sprite_thing
}
function complex_menu(group_list: string[], subgroup_list: blockObject.BlockObject[]): blockObject.BlockObject {
    while (true) {
        blockMenu.showMenu(group_list, MenuStyle.List, MenuLocation.FullScreen)
        wait_for_menu_select()
        blockMenu.closeMenu()
        if (blockMenu.selectedMenuOption() == "Cancel") {
            break
        } else {
            let subgroup_list_block: blockObject.BlockObject[] = []
            let subgroup_list_string: string[] = ["Back"]
            for (let block_obj of subgroup_list) {
                if (blockObject.getNumberProperty(block_obj, NumProp.group) == (blockMenu.selectedMenuIndex())) {
                    subgroup_list_block.push(block_obj)
                    subgroup_list_string.push(blockObject.getStringProperty(block_obj, StrProp.name))
                }
            }
            blockMenu.showMenu(subgroup_list_string, MenuStyle.List, MenuLocation.FullScreen)
            wait_for_menu_select()
            blockMenu.closeMenu()
            if (blockMenu.selectedMenuOption() == "Back") {
                // Go back to beginning
            } else {
                return subgroup_list_block[blockMenu.selectedMenuIndex() - 1]
            }
        }
    }
    return null
}
function overlapping_thing(sprite_a: Sprite) {
    for (let sprite_b of sprites.allOfKind(SpriteKind.Thing)) {
        if (sprite_a.overlapsWith(sprite_b)) {
            return true
        }
    }
    return false
}
function add_thing() {
    game.showLongText("Please select a thing to add!", DialogLayout.Bottom)
    let thing_to_summon: blockObject.BlockObject = complex_menu(shop_list_groups, shop_list)
    if (thing_to_summon != null) {
        summon_thing(
            sprite_cursor_pointer.x, 
            sprite_cursor_pointer.top, 
            blockObject.getStringProperty(thing_to_summon, StrProp.name), 
            blockObject.getNumberProperty(thing_to_summon, NumProp.index),
            blockObject.getImageProperty(thing_to_summon, ImageProp.regular_image), 
            blockObject.getImageProperty(thing_to_summon, ImageProp.selected_image)
        )
    }
}
function save_current_aquarium(name: string): string {
    let sprite_counter: number = 0
    let save_name: string = ""
    for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
        save_name = "aquarium_simulator_save_" + name + "_sprite_" + sprite_counter + "_"
        console.logValue(save_name + "index", sprites.readDataNumber(sprite, "index"))
        blockSettings.writeNumber(save_name + "index", sprites.readDataNumber(sprite, "index"))
        console.logValue(save_name + "x", sprite.x)
        blockSettings.writeNumber(save_name + "x", sprite.x)
        console.logValue(save_name + "y", sprite.y)
        blockSettings.writeNumber(save_name + "y", sprite.y)
        console.logValue(save_name + "z", sprite.z)
        blockSettings.writeNumber(save_name + "z", sprite.z)
        sprite_counter += 1
    }
    sprite_counter += 1
    console.logValue("aquarium_simulator_save_" + name + "_sprite_count", sprite_counter)
    blockSettings.writeNumber("aquarium_simulator_save_" + name + "_sprite_count", sprite_counter)
    return name
}
function load_aquarium(name: string): boolean {
    let save_name: string = "aquarium_simulator_save_" + name + "_sprite_count"
    if (blockSettings.exists(save_name)) {
        console.logValue(save_name, blockSettings.readNumber(save_name))
        let i: number = 0
        // Here
        // Problem is that while loop exits too early
        for (let i = 0; i < blockSettings.readNumber(save_name); i++){
            save_name = "aquarium_simulator_save_" + name + "_sprite_" + i + "_"
            let index: number = blockSettings.readNumber(save_name + "index")
            console.logValue(save_name + "index", blockSettings.readNumber(save_name + "index"))
            console.logValue(save_name + "x", blockSettings.readNumber(save_name + "x"))
            console.logValue(save_name + "y", blockSettings.readNumber(save_name + "y"))
            console.logValue(save_name + "z", blockSettings.readNumber(save_name + "z"))
            let sprite_thing = summon_thing(
                blockSettings.readNumber(save_name + "x"), 
                blockSettings.readNumber(save_name + "y"), 
                blockObject.getStringProperty(shop_list[index], StrProp.name), 
                index, 
                blockObject.getImageProperty(shop_list[index], ImageProp.regular_image), 
                blockObject.getImageProperty(shop_list[index], ImageProp.selected_image)
            )
            sprite_thing.z = blockSettings.readNumber(save_name + "z")
        }
        return true
    }
    return false
}
function not_implemented() {
    game.showLongText("This feature is not implemented! (Yet)", DialogLayout.Bottom)
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
sprite_cursor.z = 1000
controller.moveSprite(sprite_cursor, 100, 100)
let sprite_cursor_pointer = sprites.create(img`
    f 
    `, SpriteKind.Pointer)
sprite_cursor_pointer.z = 1001
sprite_cursor_pointer.setFlag(SpriteFlag.ShowPhysics, false)
let selected_thing: boolean = false
let selected_menu_option: boolean = false
let enable_selection: boolean = true
let moving_something: boolean = false
let menu_opened: boolean = false
let shop_list_groups: string[] = ["Cancel"]
let shop_list_subgroups: string[] = ["Back"]
let shop_list_groups_index: number = 0
let shop_list_subgroups_index: number = 0
let shop_list_index: number = 0
let shop_list: blockObject.BlockObject[] = [
    define_thing("Small Rock", "Rocks", img`
        . . . . . . . . . .
        . . . c c c c . . .
        . . c b d d d c . .
        . c b d d d d d c .
        . c b b d d d d c .
        . c b d b d d b c .
        . c c b d b b b c .
        . c c c b d d b c .
        . c c b b c c c c .
        . . . . . . . . . .
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
    define_thing("Medium Rock", "Rocks", img`
        ..................
        .........bbbbb....
        .......bbddddbb...
        ......bdddddddc...
        .....cddddddddc...
        ....cbdddddddbcc..
        ....cbbddddbcccc..
        ...ccdbbbccccccc..
        ...cccddddccdddcc.
        ..cdbccbbccdddddc.
        ..cbddbbbccdddddc.
        ..ccbbbbcbcbdddbc.
        .cbbcccccbbbbbccc.
        .ccbbcccccdddddbc.
        .ccccccbbbbbccccc.
        .cccccccbbbbbcccc.
        .ccccccccbbbbbccc.
        ..................
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
    define_thing("Big Rock", "Rocks", img`
        ..........................
        .......ccccc..............
        .....bb33bbbcc3...........
        ....bbd33d3b333...........
        ...bdddb33d3333c..........
        ..bddddb333333cbc.........
        ..bddbb333333dcbc.........
        .bddb333333333dbc.........
        .bddb33333333333cccb......
        .cdddddbb333cc33bdddbc....
        .cdddddd333cbbbbdddddcc...
        .cbddddd33bbbbbddddddccc..
        .cbbbddb33cbbbcdddddcbbcc.
        ..cbbbbbbcbbbccbdddcbbccc.
        ..cccbbbbbbbccccbbbbbcccc.
        ..........................
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
    define_thing("Small Kelp", "Kelp", img`
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
        ................
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
    define_thing("Medium Kelp", "Kelp", img`
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
        ..................
        ..........888.....
        ........88668.....
        .......86688......
        ......8768........
        .....8778.........
        .....8778.........
        ....8778..........
        ....8578..........
        ....8558..........
        ....8758......88..
        ....87678....878..
        ....87678...878...
        .....87678.8768...
        .....876768678....
        ......87668778....
        .......8668766....
        ........8687678...
        .........8667678..
        .........8685756..
        .....88..86665756.
        ....868..86685656.
        ...8668..86687678.
        ..8668..868687678.
        ..868..8688667678.
        .8768.88886876778.
        .8768.8888877678..
        .876688888676778..
        .87676888668778...
        ..876776868668....
        ..87766778868.....
        ...877667688......
        ....86767788......
        ..................
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
    define_thing("Big Kelp", "Kelp", img`
        ..................
        .....88...........
        .....868..........
        ......868.........
        .......868........
        ........868.......
        ........868.......
        .........868......
        .........868......
        .........8668.....
        .........8668.....
        .........8668.....
        .........8768.....
        .........8768.....
        ........86768.....
        ........87768.....
        ........6778......
        .......67676......
        .......67676......
        ......65656.......
        .....655656.......
        .....65656........
        ....876756........
        ...876776...8.....
        ...67678....8.....
        ..876668...88.....
        ..67868....86.....
        ..86868...876.....
        .868668..8768.....
        .86868..87678.....
        .86868..8766......
        .86868.87678......
        .86878.8766.......
        .8787887678.......
        .876768768.88.....
        .876778668.678....
        .876676668..678...
        ..676778668..678..
        ..8766778668.6778.
        ..877667688885678.
        ...87667768885656.
        ...86766778887856.
        ....8776677876876.
        .....877667768668.
        ......87766768668.
        .......877677668..
        ........87667668..
        .........876768...
        .........87688....
        ..................
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
    `),
    define_thing("Single Coral", "Coral", img`
        ..................
        .......cc.....cc..
        ....cc.c3c.cc.c3c.
        ...c36c33c.c3c63c.
        ...c33336c.c3633c.
        ....c6366ccc333c..
        .....cc66c6c633c..
        .....c3c6c33c66c..
        .cc.c33cccc33c6c..
        .c3cc366c3c36c6c..
        .c3363636333ccccc.
        ..c333c33636cc33c.
        ...c33cc3336c336..
        .ccc636cc636636cc.
        .c33333ccc363333c.
        ..cc66366c6336cc..
        ....c63366663c....
        ..................
    `, img`
        ......5555...5555.
        ...5555cc55555cc55
        ..55cc5c3c5cc5c3c5
        ..5c36c33c5c3c63c5
        ..5c33336c5c3633c5
        ..55c6366ccc333c55
        ...55cc66c6c633c5.
        55555c3c6c33c66c5.
        5cc5c33cccc33c6c5.
        5c3cc366c3c36c6c55
        5c3363636333ccccc5
        55c333c33636cc33c5
        555c33cc3336c33655
        5ccc636cc636636cc5
        5c33333ccc363333c5
        55cc66366c6336cc55
        .555c63366663c555.
        ...555555555555...
    `),
    define_thing("Left Coral Bunch", "Coral", img`
        ..................
        .......cc.....cc..
        ....cc.c3c.cc.c3c.
        ...c36c33c.c3c63c.
        ...c33336c.c3633c.
        ....c6366ccc333cc.
        .....cc66c6c633cc.
        .....c3c6c33cc6cc.
        .cc.c33cccc3c36c6.
        .c3cc366c3c3c33c3.
        .c3363636333cc363.
        ..c333c3363c6c633.
        ...c33cc333c33c36.
        .ccc636cc636c333c.
        .c33333ccc36cc63c.
        ..cc66366c63c666c.
        ....c633666cc66cc.
        ..................
    `, img`
        ......5555...5555.
        ...5555cc55555cc55
        ..55cc5c3c5cc5c3c5
        ..5c36c33c5c3c63c5
        ..5c33336c5c3633c5
        ..55c6366ccc333cc5
        ...55cc66c6c633cc5
        55555c3c6c33cc6cc5
        5cc5c33cccc3c36c65
        5c3cc366c3c3c33c35
        5c3363636333cc3635
        55c333c3363c6c6335
        555c33cc333c33c365
        5ccc636cc636c333c5
        5c33333ccc36cc63c5
        55cc66366c63c666c5
        .555c633666cc66cc5
        ...555555555555555
    `),
    define_thing("Center Coral Bunch", "Coral", img`
        ..................
        ......cc......cc..
        ..cc..c3c..cc.c3c.
        ..c3cc33c..c3c63c.
        ..c33c36c..c3633c.
        .ccc6366c.cc333cc.
        .33cc66c6c6c633cc.
        .633ccc36c33cc6cc.
        .3633633ccc3c36c6.
        .3c6333cc3c3c33c3.
        .ccc33c36333cc363.
        .ccc63c3363c6c633.
        .63c636c333c33c36.
        .6336663c636c333c.
        .c63363ccc36cc63c.
        .cc666cc6c63c666c.
        .ccc66cc666cc66cc.
        ..................
    `, img`
        .....5555....5555.
        .55555cc555555cc55
        .5cc55c3c55cc5c3c5
        .5c3cc33c55c3c63c5
        55c33c36c55c3633c5
        5ccc6366c5cc333cc5
        533cc66c6c6c633cc5
        5633ccc36c33cc6cc5
        53633633ccc3c36c65
        53c6333cc3c3c33c35
        5ccc33c36333cc3635
        5ccc63c3363c6c6335
        563c636c333c33c365
        56336663c636c333c5
        5c63363ccc36cc63c5
        5cc666cc6c63c666c5
        5ccc66cc666cc66cc5
        555555555555555555
    `),
    define_thing("Right Coral Bunch", "Coral", img`
        ..................
        ......cc......cc..
        ..cc..c3c..cc.c3c.
        ..c3cc33c..c3c63c.
        ..c33c36c..c3633c.
        .ccc6366c.cc333c..
        .33cc66c6c6c633c..
        .633ccc36c33c66c..
        .3633633ccc33c6c..
        .3c6333cc3c36c6c..
        .ccc33c36333ccccc.
        .ccc63c33636cc33c.
        .63c636c3336c336..
        .6336663c636636cc.
        .c63363ccc363333c.
        .cc666cc6c6336cc..
        .ccc66cc66663c....
        ..................
    `, img`
        .....5555....5555.
        .55555cc555555cc55
        .5cc55c3c55cc5c3c5
        .5c3cc33c55c3c63c5
        55c33c36c55c3633c5
        5ccc6366c5cc333c55
        533cc66c6c6c633c5.
        5633ccc36c33c66c5.
        53633633ccc33c6c5.
        53c6333cc3c36c6c55
        5ccc33c36333ccccc5
        5ccc63c33636cc33c5
        563c636c3336c33655
        56336663c636636cc5
        5c63363ccc363333c5
        5cc666cc6c6336cc55
        5ccc66cc66663c555.
        555555555555555...
    `),
    define_thing("Single Sand Block", "Sand Blocks", img`
        ..................
        .....bbbb333b.....
        ...3bdd333dddb3...
        ..33dddddddddd33..
        .33dddddddddddd33.
        .3ddddddddddddddb.
        .bdddddddd1dddddb.
        .bddddd3ddddddd3b.
        .bd333ddd3d333ddb.
        .b3d3b3ddd3d3b3db.
        .c333333b3333333c.
        .c3333d3333333d3c.
        .c3ccc33dd3ccc33c.
        .cbbbbc3ddbbbbc3c.
        .cbbbbbccbbbbbbcc.
        ..ccbbccccbbbccc..
        ...cccccccccccc...
        ..................
    `, img`
        ....5555555555....
        ..555bbbb333b555..
        .553bdd333dddb355.
        5533dddddddddd3355
        533dddddddddddd335
        53ddddddddddddddb5
        5bdddddddd1dddddb5
        5bddddd3ddddddd3b5
        5bd333ddd3d333ddb5
        5b3d3b3ddd3d3b3db5
        5c333333b3333333c5
        5c3333d3333333d3c5
        5c3ccc33dd3ccc33c5
        5cbbbbc3ddbbbbc3c5
        5cbbbbbccbbbbbbcc5
        55ccbbccccbbbccc55
        .55cccccccccccc55.
        ..55555555555555..
    `),
    define_thing("Left Edge Sand Block", "Sand Blocks", img`
        ..................
        .....bbb3333bbbb3.
        ...3b3333ddddd333.
        ..33ddddddddddddd.
        .33dddddddddddddd.
        .3dddddd1dddddddd.
        .bdddd3dddddddddd.
        .b333ddd3ddddd3dd.
        .bd3b3dddd3ddddd3.
        .bb33d3b33d333ddd.
        .cccc33dd333b33b3.
        .ccbbc3ddcc33d333.
        .cbbbbccbbbcc33dd.
        .cbbbbbbbbbbbc3dd.
        .ccbbcccbbbbccccb.
        ..cccccccbbcccccc.
        ...cccccccccccccc.
        ..................
    `, img`
        ....55555555555555
        ..555bbb3333bbbb35
        .553b3333ddddd3335
        5533ddddddddddddd5
        533dddddddddddddd5
        53dddddd1dddddddd5
        5bdddd3dddddddddd5
        5b333ddd3ddddd3dd5
        5bd3b3dddd3ddddd35
        5bb33d3b33d333ddd5
        5cccc33dd333b33b35
        5ccbbc3ddcc33d3335
        5cbbbbccbbbcc33dd5
        5cbbbbbbbbbbbc3dd5
        5ccbbcccbbbbccccb5
        55cccccccbbcccccc5
        .55cccccccccccccc5
        ..5555555555555555
    `),
    define_thing("Center Sand Block", "Sand Blocks", img`
        ..................
        .333bbbb3333bbbb3.
        .ddddd333ddddd333.
        .dddddddddddddddd.
        .dddddddddddddddd.
        .dddddddddddddddd.
        .1dddddd1dddddddd.
        .ddddd3ddddddd3dd.
        .d333ddd3d333ddd3.
        .3d3b3ddd3d3b3ddd.
        .333333b3333333b3.
        .3333d3333333d333.
        .3ccc33dd3ccc33dd.
        .bbbbc3ddbbbbc3dd.
        .bbbbbcccbbbbbccb.
        .bbbcccccccbbcccc.
        .cccccccccccccccc.
        ..................
    `, img`
        555555555555555555
        5333bbbb3333bbbb35
        5ddddd333ddddd3335
        5dddddddddddddddd5
        5dddddddddddddddd5
        5dddddddddddddddd5
        51dddddd1dddddddd5
        5ddddd3ddddddd3dd5
        5d333ddd3d333ddd35
        53d3b3ddd3d3b3ddd5
        5333333b3333333b35
        53333d3333333d3335
        53ccc33dd3ccc33dd5
        5bbbbc3ddbbbbc3dd5
        5bbbbbcccbbbbbccb5
        5bbbcccccccbbcccc5
        5cccccccccccccccc5
        555555555555555555
    `),
    define_thing("Right Edge Sand Block", "Sand Blocks", img`
        ..................
        .333bbbb3333b.....
        .ddddd333ddd3b3...
        .ddddddddddddd33..
        .dddddddddddddd33.
        .dddddddddddddddb.
        .1ddddddddddddddb.
        .dddddddd1d33dd3b.
        .d333d3ddddbd3b3b.
        .3d3b3dd3d333dd3b.
        .3333dddd3dccdd3c.
        .3333d3b333bbcccc.
        .3ccc33dd3bbbbbcc.
        .bbbbc3ddbbbbbbbc.
        .bbbbccccbbbbbbcc.
        .bbbcccccccbbbcc..
        .cccccccccccccc...
        ..................
    `, img`
        55555555555555....
        5333bbbb3333b555..
        5ddddd333ddd3b355.
        5ddddddddddddd3355
        5dddddddddddddd335
        5dddddddddddddddb5
        51ddddddddddddddb5
        5dddddddd1d33dd3b5
        5d333d3ddddbd3b3b5
        53d3b3dd3d333dd3b5
        53333dddd3dccdd3c5
        53333d3b333bbcccc5
        53ccc33dd3bbbbbcc5
        5bbbbc3ddbbbbbbbc5
        5bbbbccccbbbbbbcc5
        5bbbcccccccbbbcc55
        5cccccccccccccc55.
        5555555555555555..
    `)
]
blockMenu.setColors(1, 15)
scene.setBackgroundColor(9)
tiles.setTilemap(tilemap`level`)
tiles.placeOnTile(sprite_cursor, tiles.getTileLocation(3, 3))
scene.cameraFollowSprite(sprite_cursor)
// The sprite cursor pointer is the thing we use for overlaps
forever(function () {
    sprite_cursor_pointer.top = sprite_cursor.top
    sprite_cursor_pointer.left = sprite_cursor.left
})
// Hid the pointer if we aren't at the cursor pointer (so cursor point is red)
game.onUpdate(function() {
    sprite_cursor_pointer.setFlag(SpriteFlag.Invisible, (sprite_cursor_pointer.top != sprite_cursor.top || sprite_cursor_pointer.left != sprite_cursor.left))
})
// Highlight the selected sprite
forever(function() {
    for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
        if (sprite == last_selected_thing && selected_thing) {
            sprite.setImage(sprites.readDataImage(sprite, "selected_image"))
        } else {
            sprite.setImage(sprites.readDataImage(sprite, "regular_image"))
        }
    }
    pause(100)
})
// Keep the sprites within the tank
forever(function() {
    for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
        if (sprite.top < 32) {
            sprite.top = 32
        }
        if (sprite.right > 240) {
            sprite.right = 240
        }
        if (sprite.bottom > 144) {
            sprite.bottom = 144
        }
        if (sprite.left < 16) {
            sprite.left = 16
        }
    }
    pause(100)
})
// Have last_selected_sprite follow cursor when moving it.
forever(function() {
    if (moving_something) {
        last_selected_thing.setPosition(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else {
        pause(100)
    }
})