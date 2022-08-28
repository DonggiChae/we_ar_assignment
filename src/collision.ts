interface IState {
  display: Canvas, 
  actors: Ball[]
}

class State {
  display: Canvas;
  actors: Ball[];

  constructor(display: Canvas, actors: Ball[]) {
    this.display = display;
    this.actors = actors;
  }

  update(time: number) {

    const updateId = Math.floor(Math.random() * 1000000);
    const actors = this.actors.map(actor => {
      return actor.update(this, time, updateId);
    });
    return new State(this.display, actors);
  }
}

interface IVector {
  x:number;
  y:number;
}

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add = (vector: IVector ): Vector => {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract = (vector: IVector ): Vector =>{
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply = (scalar: number ): Vector =>{
    return new Vector(this.x * scalar, this.y * scalar);
  }

  dotProduct = (vector: IVector ): number => {
    return this.x * vector.x + this.y * vector.y;
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get direction() {
    return Math.atan2(this.x, this.y);
  }
}

class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  
  constructor(canvas: HTMLCanvasElement, width = 1000, height = 500) {
    this.canvas = canvas
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
  }

  sync(state: IState) {
    this.clearDisplay();
    this.drawActors(state.actors);
  }

  clearDisplay() {
    this.ctx!.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx!.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawActors(actors: Ball[]) {
    for (let actor of actors) {
      if (actor.type === 'circle') {
        this.drawCircle(actor);
      }
    }
  }

  drawCircle(actor: Ball) {
    this.ctx?.beginPath();
    this.ctx?.arc(actor.position.x, actor.position.y, actor.radius, 0, Math.PI * 2);
    this.ctx!.fillStyle = actor.color;
    this.ctx?.fill();
    this.ctx?.closePath();
  }
}

interface IBall {
  id?: number,
  type?: string,
  position?: IVector,
  velocity?: IVector,
  radius?: number,
  color?: string,
  collisions?: Array<number>,
}


class Ball {
  id: number = 0;
  type: string = 'circle';
  position = new Vector(0,0);
  velocity = new Vector(0,0);;
  radius: number = 0;
  color: string = 'black';
  collisions: Array<number> = [];

  constructor(config: IBall) {
    Object.assign(this,
      {
        id: Math.floor(Math.random() * 1000000),
        type: 'circle',
        position: new Vector(100, 100),
        velocity: new Vector(5, 3),
        radius: 25,
        color: 'blue',
        collisions: [],
      },
      config
    );
  }

  update(state: IState, time: number, updateId: number) {

    if (this.collisions.length > 10) {
      this.collisions = this.collisions.slice(this.collisions.length - 3);
    }


    for (let actor of state.actors) {
      if (this === actor || this.collisions.includes(actor.id + updateId)) {
        continue;
      }
      const distance = this.position.add(this.velocity).subtract(actor.position.add(actor.velocity)).magnitude;
      const distanceCenterToCenter = this.position.subtract(actor.position).magnitude;
      
      if (distanceCenterToCenter < this.radius + actor.radius) {
        this.position = this.position.add(this.position.add(actor.position))
      }
      if (distance <= this.radius + actor.radius) {
        const v1 = collisionVector(this, actor);
        const v2 = collisionVector(actor, this);
        this.velocity = v1;
        actor.velocity = v2;
        this.collisions.push(actor.id + updateId);
        actor.collisions.push(this.id + updateId);
      }
    }
    
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

    return new Ball({
      ...this,
      position: new Vector(newX, newY),
    });
  }
}

// elastic collision: https://en.wikipedia.org/wiki/Elastic_collision
const collisionVector = (particle1: Ball, particle2: Ball) => {
  return particle1.velocity
    .subtract(particle1.position
      .subtract(particle2.position)
      .multiply(particle1.velocity
        .subtract(particle2.velocity)
        .dotProduct(particle1.position.subtract(particle2.position))
        / particle1.position.subtract(particle2.position).magnitude ** 2
      )
    );
};

const runAnimation = (animation: (time: number) => void) => {
  let lastTime: number | null  = null;
  let stop = false;
  let frameCount = 0;
  let fps = 30;
  let startTime;
  let now = 0;
  let then = 0;
  let elapsed = 0; 
  let fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;

  const frame = (startTime: number) => {
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      if (animation(then) !== undefined) {
        return;
      }
  };
  requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};


function random(max = 20, min = 10){
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function plusOrMinus() {
  const myArray = [1, -1];
  let rand = Math.floor(Math.random()*myArray.length);
  let rValue = myArray[rand];
  return rValue
}


const collidingBalls = ({ width = 1000, height = 500, parent = document.querySelector("canvas"), count = random(20, 10) } = {}) => {
  const display = new Canvas(parent as HTMLCanvasElement, width, height);
  const balls = [];
  for (let i = 0; i <= count; i++) {
    balls.push(new Ball({
      radius: random(20, 10),
      color: "black",
      position: new Vector(random(width - 10, 10), random(height - 10, 10)),
      velocity: new Vector(plusOrMinus() * random(2, 4), plusOrMinus() * random(2, -4)),
    }));
  }
  let state = new State(display, balls);
  runAnimation((time : number) => {
    state = state.update(time);
    display.sync(state);
  });
};

collidingBalls();