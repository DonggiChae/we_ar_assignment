"use strict";
class State {
    constructor(display, actors) {
        this.display = display;
        this.actors = actors;
    }
    update(time) {
        /**
         * provide an update ID to let actors
         * update other actors only once.
         * used with collision detection.
         */
        const updateId = Math.floor(Math.random() * 1000000);
        const actors = this.actors.map(actor => {
            return actor.update(this, time, updateId);
        });
        return new State(this.display, actors);
    }
}
class Vector {
    constructor(x, y) {
        this.add = (vector) => {
            return new Vector(this.x + vector.x, this.y + vector.y);
        };
        this.subtract = (vector) => {
            return new Vector(this.x - vector.x, this.y - vector.y);
        };
        this.multiply = (scalar) => {
            return new Vector(this.x * scalar, this.y * scalar);
        };
        this.dotProduct = (vector) => {
            return this.x * vector.x + this.y * vector.y;
        };
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    get direction() {
        return Math.atan2(this.x, this.y);
    }
}
class Canvas {
    constructor(canvas, width = 1000, height = 500) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
    }
    sync(state) {
        this.clearDisplay();
        this.drawActors(state.actors);
    }
    clearDisplay() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawActors(actors) {
        for (let actor of actors) {
            if (actor.type === 'circle') {
                this.drawCircle(actor);
            }
        }
    }
    drawCircle(actor) {
        var _a, _b, _c, _d;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.arc(actor.position.x, actor.position.y, actor.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = actor.color;
        (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.fill();
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.closePath();
    }
}
class Ball {
    constructor(config) {
        this.id = 0;
        this.type = 'circle';
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.radius = 0;
        this.color = 'black';
        this.collisions = [];
        Object.assign(this, {
            id: Math.floor(Math.random() * 1000000),
            type: 'circle',
            position: new Vector(100, 100),
            velocity: new Vector(5, 3),
            radius: 25,
            color: 'blue',
            collisions: [],
        }, config);
    }
    ;
    update(state, time, updateId) {
        /**
         * if slice occurs on too many elements, it starts to lag
         * collisions is an array to allow multiple collisions at once
         */
        if (this.collisions.length > 10) {
            this.collisions = this.collisions.slice(this.collisions.length - 3);
        }
        /**
         * this is the most stable solution to avoid overlap
         * but it is slightly inaccurate
         */
        for (let actor of state.actors) {
            if (this === actor || this.collisions.includes(actor.id + updateId)) {
                continue;
            }
            /**
             * check if actors collide in the next frame and update now if they do
             * innaccurate, but it is the easiest solution to the sticky collision bug
             */
            const distance = this.position.add(this.velocity).subtract(actor.position.add(actor.velocity)).magnitude;
            const distanceCenterToCenter = this.position.subtract(actor.position).magnitude;
            if (distanceCenterToCenter < this.radius + actor.radius) {
                this.position = this.position.subtract(this.position.subtract(actor.position));
            }
            else if (distance <= this.radius + actor.radius) {
                const v1 = collisionVector(this, actor);
                const v2 = collisionVector(actor, this);
                this.velocity = v1;
                actor.velocity = v2;
                this.collisions.push(actor.id + updateId);
                actor.collisions.push(this.id + updateId);
            }
        }
        // setting bounds on the canvas prevents balls from overlapping on update
        const upperLimit = new Vector(state.display.canvas.width - this.radius, state.display.canvas.height - this.radius);
        const lowerLimit = new Vector(0 + this.radius, 0 + this.radius);
        if (this.position.x >= upperLimit.x || this.position.x <= lowerLimit.x) {
            this.velocity = new Vector(-this.velocity.x, this.velocity.y);
        }
        if (this.position.y >= upperLimit.y || this.position.y <= lowerLimit.y) {
            this.velocity = new Vector(this.velocity.x, -this.velocity.y);
        }
        const newX = Math.max(Math.min(this.position.x + this.velocity.x, upperLimit.x), lowerLimit.x);
        const newY = Math.max(Math.min(this.position.y + this.velocity.y, upperLimit.y), lowerLimit.y);
        return new Ball(Object.assign(Object.assign({}, this), { position: new Vector(newX, newY) }));
    }
}
// see elastic collision: https://en.wikipedia.org/wiki/Elastic_collision
const collisionVector = (particle1, particle2) => {
    return particle1.velocity
        .subtract(particle1.position
        .subtract(particle2.position)
        .multiply(particle1.velocity
        .subtract(particle2.velocity)
        .dotProduct(particle1.position.subtract(particle2.position))
        / particle1.position.subtract(particle2.position).magnitude ** 2));
};
const runAnimation = (animation) => {
    let lastTime = null;
    const frame = (time) => {
        if (lastTime !== null) {
            const timeStep = Math.min(100, time - lastTime) / 1000;
            if (animation(timeStep) !== undefined) {
                return;
            }
        }
        lastTime = time;
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};
function random(max = 20, min = 10) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
;
const collidingBalls = ({ width = 1000, height = 500, parent = document.querySelector("canvas"), count = random(20, 10) } = {}) => {
    const display = new Canvas(parent, width, height);
    const balls = [];
    for (let i = 0; i <= count; i++) {
        balls.push(new Ball({
            radius: random(20, 10),
            color: "black",
            position: new Vector(random(width - 10, 10), random(height - 10, 10)),
            velocity: new Vector(random(3, -3), random(3, -3)),
        }));
    }
    let state = new State(display, balls);
    runAnimation((time) => {
        state = state.update(time);
        display.sync(state);
    });
};
collidingBalls();
