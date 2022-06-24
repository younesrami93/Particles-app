class ComponantMaker {

    static getWallpaperLayerTree() {
        var tree = [];
        tree.push(menuMaker.createObject("Duplicate", 1));
        tree.push(menuMaker.createObject("Delete", 2));
        return tree;
    }

    static getComponantsTree() {
        var tree = [];
        var behavior = menuMaker.createObject("Add behavior", -1)
        var newBh = menuMaker.createObject("New behavior", -1)
        var preset = menuMaker.createObject("Preset", -1)
        behavior.childs.push(newBh);
        behavior.childs.push(preset);

        tree.push(menuMaker.createObject("Duplicate", 1));
        tree.push(behavior);
        tree.push(menuMaker.createObject("Save as preset", 2));
        tree.push(menuMaker.createObject("Delete", 3));

        var move = menuMaker.createObject("Move", -1)
        var speed = menuMaker.createObject("Speed", -1)
        var velocity = menuMaker.createObject("Velocity", -1)
        var Scale = menuMaker.createObject("Scale", -1)
        var Rotate = menuMaker.createObject("Rotate", -1)
        var Direction = menuMaker.createObject("Direction", -1)
        var DirectionalSpeed = menuMaker.createObject("Directional Speed", -1)
        var Fade = menuMaker.createObject("Fade", -1)
        var Fall = menuMaker.createObject("Fall", -1)
        var Effects = menuMaker.createObject("Effects", -1)

        newBh.childs = menuMaker.createObjects([
            ["Position Changer", 17],
            ["Speed Changer", 17],
            ["Velocity Changer", 18],
            ["Rotation Changer", 17],
            ["Alpha Changer", 17],
            ["Size Changer", 17]
        ])


        Rotate.childs = menuMaker.createObjects([
            ["Rotate Left", 17, {
                property: Particle.Prop.ROTATION,
                speed: [
                    [10, 20],
                    [0, 0]
                ],
                timing: [0, 100],
                title: "Rotate Left"
            }],
            ["Rotate Right", 18, {
                property: Particle.Prop.ROTATION,
                speed: [
                    [-10, -20],
                    [0, 0]
                ],
                timing: [0, 100],
                title: "Rotate Right"
            }],
            ["Custom Rotation", 16, {
                property: Particle.Prop.ROTATION,
                speed: [
                    [-1, -2],
                    [-1, -2]
                ],
                timing: [70, 100],
                title: "Custom Rotation",
                isCustom: true
            }]
        ])

        Scale.childs = menuMaker.createObjects([
            ["Grow", 17, {
                property: Particle.Prop.SIZE,
                speed: [
                    [5, 5],
                    [5, 5]
                ],
                timing: [0, 100],
                title: "Grow"
            }],
            ["Shrink", 18, {
                property: Particle.Prop.SIZE,
                speed: [
                    [-5, -5],
                    [-5, -5]
                ],
                timing: [0, 100],
                title: "Shrink"
            }],
            ["Custom Size", 16, {
                property: Particle.Prop.SIZE,
                speed: [
                    [-1, -2],
                    [-1, -2]
                ],
                timing: [70, 100],
                title: "Custom Size",
                isCustom: true
            }]
        ])

        move.childs = menuMaker.createObjects([
            ["to Left", 11, {
                property: Particle.Prop.POSITION,
                speed: [
                    [-10, 0],
                    [-20, 0]
                ],
                timing: [0, 100],
                title: "Move left"
            }],
            ["to Right", 12, {
                property: Particle.Prop.POSITION,
                speed: [
                    [10, 0],
                    [20, 0]
                ],
                timing: [0, 100],
                title: "Move right"
            }],
            ["to Top", 13, {
                property: Particle.Prop.POSITION,
                speed: [
                    [0, -10],
                    [0, -20]
                ],
                timing: [0, 100],
                title: "Move top"
            }],
            ["to Bottom", 14, {
                property: Particle.Prop.POSITION,
                speed: [
                    [0, 10],
                    [0, 20]
                ],
                timing: [0, 100],
                title: "Move down"
            }],
            ["Custom Movement", 14, {
                property: Particle.Prop.POSITION,
                speed: [
                    [0, 10]
                ],
                timing: [0, 100],
                title: "Custom Movement",
                isCustom: true
            }]
        ])

        speed.childs = menuMaker.createObjects([
            ["to Left", 11, {
                property: Particle.Prop.SPEED,
                speed: [
                    [-10, 0],
                    [-20, 0]
                ],
                timing: [0, 100],
                title: "Speed to left"
            }],
            ["to Right", 12, {
                property: Particle.Prop.SPEED,
                speed: [
                    [10, 0],
                    [20, 0]
                ],
                timing: [0, 100],
                title: "Speed to right"
            }],
            ["to Top", 13, {
                property: Particle.Prop.SPEED,
                speed: [
                    [0, -10],
                    [0, -20]
                ],
                timing: [0, 100],
                title: "Speed to top"
            }],
            ["to Bottom", 14, {
                property: Particle.Prop.SPEED,
                speed: [
                    [0, 10],
                    [0, 20]
                ],
                timing: [0, 100],
                title: "Speed to bottom"
            }],
            ["Custom Speed", 14, {
                property: Particle.Prop.SPEED,
                speed: [
                    [0, 10]
                ],
                timing: [0, 100],
                title: "Custom Speed",
                isCustom: true
            }]
        ])

        velocity.childs = menuMaker.createObjects([
            ["to Left", 11, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [-10, 0],
                    [-20, 0]
                ],
                timing: [0, 100],
                title: "velocity to left"
            }],
            ["to Right", 12, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [10, 0],
                    [20, 0]
                ],
                timing: [0, 100],
                title: "velocity to right"
            }],
            ["to Top", 13, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [0, -10],
                    [0, -20]
                ],
                timing: [0, 100],
                title: "velocity to top"
            }],
            ["to Bottom", 14, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [0, 10],
                    [0, 20]
                ],
                timing: [0, 100],
                title: "velocity to bottom"
            }],
            ["Custom Velocity", 14, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [0, 10]
                ],
                timing: [0, 100],
                title: "Custom Velocity",
                isCustom: true
            }]
        ])

        Fade.childs = menuMaker.createObjects([
            ["Fade in", 15, {
                property: Particle.Prop.ALPHA,
                speed: [
                    [1, 2],
                    [1, 2]
                ],
                timing: [0, 20],
                title: "Fade in"
            }],
            ["Fade out", 16, {
                property: Particle.Prop.ALPHA,
                speed: [
                    [-1, -2],
                    [-1, -2]
                ],
                timing: [70, 100],
                title: "Fade out"
            }],
            ["Custom Alpha", 16, {
                property: Particle.Prop.ALPHA,
                speed: [
                    [-1, -2],
                    [-1, -2]
                ],
                timing: [70, 100],
                title: "Fade out",
                isCustom: true
            }],
            ["Fade InOut", 16, [{
                property: Particle.Prop.ALPHA,
                speed: [
                    [1, 2],
                    [1, 2]
                ],
                timing: [0, 20],
                title: "Fade in"
            }, {
                property: Particle.Prop.ALPHA,
                speed: [
                    [-1, -2],
                    [-1, -2]
                ],
                timing: [70, 100],
                title: "Fade out"
            }]]
        ])

        Fall.childs = menuMaker.createObjects([
            ["fall slow", 17, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [0, 10],
                    [0, 5]
                ],
                timing: [0, 100],
                title: "fall slow"
            }],
            ["fall fast", 18, {
                property: Particle.Prop.VELOCITY,
                speed: [
                    [0, 40],
                    [0, 20]
                ],
                timing: [0, 100],
                title: "fall fast"
            }]
        ])

        Effects.childs = menuMaker.createObjects([
            ["Snow movement", 19],
            ["Rain movment", 20],
            ["stars shine", 21],
            ["mist effect", 22],
            ["leaf fall", 23]
        ])


        
        Direction.childs = menuMaker.createObjects([
            ["Speed Direction", 24, {
                property: Particle.Prop.DIRECTION,
                speed: [
                    [90, 90],
                    [90, 90]
                ],
                timing: [0, 100],
                title: "Speed Direction"
            }]
        ])



        
        DirectionalSpeed.childs = menuMaker.createObjects([
            ["Directional Speed", 24, {
                property: Particle.Prop.MOVE_DIRECTION,
                speed: [
                    [90, 90],
                    [90, 90]
                ],
                timing: [0, 100],
                title: "Directional Speed"
            }]
        ])





        preset.childs.push(move);
        preset.childs.push(speed);
        preset.childs.push(velocity);
        preset.childs.push(Rotate);
        preset.childs.push(Direction);
        preset.childs.push(DirectionalSpeed);
        preset.childs.push(Scale);
        preset.childs.push(Fade);
        preset.childs.push(Fall);
        preset.childs.push(Effects);
        return tree;
    }
}