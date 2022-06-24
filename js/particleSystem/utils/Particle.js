class Particle {
    static Prop = {
        SPEED: "SPEED",
        VELOCITY: "VELOCITY",
        POSITION: "POSITION",
        SIZE: "SIZE",
        ALPHA: "ALPHA",
        DIRECTION: "DIRECTION",
        MOVE_DIRECTION: "MOVE_DIRECTION",
        ROTATION: "ROTATION"
    };

    static getPropertiesList() {
        var data = [Particle.Prop.SPEED,
            Particle.Prop.VELOCITY,
            Particle.Prop.POSITION,
            Particle.Prop.SIZE,
            Particle.Prop.ALPHA,
            Particle.Prop.DIRECTION,
            Particle.Prop.MOVE_DIRECTION,
            Particle.Prop.ROTATION
        ]
        console.log(data);
        return data;
    }

    Age = 0;
    AgeAtLastFrame = 0;
    fitWindow = false;
    position = new Vector();
    size = new Vector();
    depth = false;

    texture;

    rotation = new Vector(0.0, 0.0, 0.0);
    paralaxOffset = 0.0;
    velocity = new Vector();
    speed = new Vector();
    rotationSpeed = new Vector();

    createdTime = 0;
    endTime = 0;
    lifeSpanMs = 0;
    isDead = false;

    mipmaps;
    invincible = false;
    alpha = new Vector(1.0, 1.0, 1.0);
    oldScal = 1;




    constructor(offset) {
        if (offset === undefined)
            this.paralaxOffset = 0;
        if (isNaN(offset)) {
            this.paralaxOffset = offset.getRandom();
        } else {
            this.paralaxOffset = offset;
        }
        //this.paralaxOffset *= 10;
    }

    setLife(lifeInSeconds) {
        this.createdTime = Date.now();
        this.lifeSpanMs = lifeInSeconds * 1000;
        this.endTime = this.createdTime + this.lifeSpanMs;
    }

    //update once at first update createdTime and endTime
    updateCTandET() {
        this.createdTime = Date.now();
        this.endTime = this.createdTime + this.lifeSpanMs;
    }

    getProperty(prop) {

        switch (prop) {
            case Particle.Prop.SIZE:
                return this.size;
            case Particle.Prop.POSITION:
                return this.position;
            case Particle.Prop.SPEED:
                return this.speed;
            case Particle.Prop.VELOCITY:
                return this.velocity;
            case Particle.Prop.ALPHA:
                return this.alpha;
            case Particle.Prop.ROTATION:
                return this.rotationSpeed;
            default:
                return null;
        }
    }



    getX(portWidth) {
        if (portWidth === undefined)
            return this.position.x - this.getWidth(portWidth) / 2;
        return (this.getX() * (portWidth / 100) /*+ parallaxManager.getValueOfXOffset(this.paralaxOffset)*/ );
    }

    getY(portWidth) {
        if (portWidth === undefined)
            return this.position.y - this.getHeight(portWidth) / 2;
        return (this.getY() * (portWidth / 100) /*+ parallaxManager.getValueOfYOffset(this.paralaxOffset)*/ );
    }

    getWidth(portWidth) {
        if (portWidth === undefined)
            return this.size.x < 0 ? 0 : this.size.x;
        var width = (this.size.x * (portWidth / 100));
        return width < 0 ? 0 : width;
    }

    getHeight(portWidth) {
        if (portWidth === undefined)
            return this.size.y < 0 ? 0 : this.size.y;
        var height = (this.size.y * (portWidth / 100));
        return height < 0 ? 0 : height;
    }

    setHeight(height) {
        this.size.y = height;
    }

    setWidth(width) {
        this.size.x = width;
    }


    setTexture(_texture) {
        this.texture = _texture;
        /*bmpHeight = bitmapTexture.getHeight();
        bmpWidth = bitmapTexture.getWidth();*/
    }



    destroy() {
        //bitmapTexture.destroyTexture();
    }


    updatedOnce = false;
    update(deltaTime) {
        if (!this.updatedOnce) {
            this.updatedOnce = true;
            this.updateCTandET();
        }
        this.AgeAtLastFrame = this.Age;
        this.Age = this.getAge();
        if (this.isDead)
            return;
        this.speed.add(this.velocity, deltaTime);
        this.position.add(this.speed, deltaTime);

        var rotSpeed = this.rotationSpeed.y - this.rotationSpeed.x;
        rotSpeed = Math.random() * rotSpeed
        rotSpeed = rotSpeed + this.rotationSpeed.x;
        this.rotation.x += rotSpeed * deltaTime;

        if (this.invincible)
            return;
        else if (Date.now() > this.endTime) {
            this.isDead = true;
        }
    }

    draw(ctx, portWidth, portHeight, deltaTime , a1) {

      if(a1 == undefined)
            a1 = 1;
        if (this.isDead)
            return false;
        if(ctx == null)
            return true;
        ctx.save();


        var cx = this.getX(portWidth) + this.getWidth(portWidth) / 2
        var cy = this.getY(portWidth) + this.getHeight(portWidth) / 2


        ctx.translate(cx, cy);
        ctx.rotate(this.rotation.x * Math.PI / 180);
        ctx.translate(-cx, -cy);


        var scale = 1 + Math.abs(this.paralaxOffset / globals.width);

        var scal = 0;
        var scalY = 0;
        var scalX = 0;
        if (this.depth) {
            var yOffset = parallaxManager.yOffset / 50
                //console.log("offset" + yOffset)
            $(".footer").html(yOffset)
            yOffset -= 1;
            yOffset /= 2;

            scal = this.paralaxOffset * Math.sin(yOffset) * parallaxManager.strength;
            scal = (Math.abs(scal)) * 0.01;
            scale += scal
            ctx.translate(portWidth / 2, portHeight / 2);
            ctx.scale(scale, scale)
            ctx.translate(-portWidth / 2, -portHeight / 2);
        }


        if (this.alpha.x > 1)
            this.alpha.x = 1;
        else if (this.alpha.x < 0)
            this.alpha.x = 0;


        ctx.globalAlpha = this.alpha.x * a1;
        if (this.texture != null) {
            ctx.globalCompositeOperation = this.texture.filter;
            var xp = this.getX(portWidth) + parallaxManager.getValueOfXOffset(this.paralaxOffset) + scalX;
            var yp = this.getY(portWidth) + parallaxManager.getValueOfYOffset(this.paralaxOffset) + scalY;
            //xp = xp * Math.sin(xp) + yp * Math.cos(yp)
            //yp = yp * Math.cos(yp) + xp * Math.sin(xp)
            ctx.drawImage(this.texture.bmp, xp, yp, this.getWidth(portWidth), this.getHeight(portWidth));
           /* if(this.texture.tint != "#00000000")
            {
                ctx.fillStyle = this.texture.tint;
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillRect(xp, yp, this.getWidth(portWidth), this.getHeight(portWidth));
                ctx.drawImage(this.texture.bmp, xp, yp, this.getWidth(portWidth), this.getHeight(portWidth));        
            }*/
            
        }
        ctx.restore();
        return true;
    }



    setInvincible(invincible) {
        this.invincible = invincible;
    }

    isInvincible() {
        return this.invincible;
    }


    inTimeSpan(startTime, finishTime) {
        var age = this.getAge();
        return (age >= startTime && age < finishTime);
    }
    getAge() {
        var age = ((Date.now() - this.createdTime));
        age = (age / this.lifeSpanMs) * 100;
        return age;
    }

    //Object.freeze(DaysEnum)
    /*const Prop = {
        SPEED: 'SPEED',
        VELOCITY: 'VELOCITY',
        SIZE: 'SIZE',
        POSITION: 'POSITION'
    }*/
}