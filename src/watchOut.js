let gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

let gameStats = {
  score: 0,
  bestScore: 0
};

let gameBoard = d3.select('.main').append('svg:svg')
                                  .attr('width', gameOptions.width)
                                  .attr('height', gameOptions.height)
                                  .attr('class', 'gameBoard');

let axes = {
  x: d3.scaleLinear().domain([0, 100]).range(0, gameOptions.width),
  y: d3.scaleLinear().domain([0, 100]).range(0, gameOptions.height)
};

// Construct player
class Player {
  constructor() {
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.x = 0;
    this.y = 0;
    this.r = 5;
    this.angle = 0;
    this.fill = '#ff6600';
    this.el = gameBoard.append('svg:path').attr('d', this.path).attr('fill', this.fill).attr('class', 'player');
    this.transform();
    this.dragging();
  }
  setX(x) {
    let minX = gameOptions.padding;
    let maxX = gameOptions.width - minX;
    if (x <= minX) {
      x = minX;
    } else if (x >= maxX) {
      x = maxX;
    }
    this.x = x;
  }
  setY(y) {
    let minY = gameOptions.padding;
    let maxY = gameOptions.height - minY;
    if (y <= minY) {
      y = minY;
    } else if (y >= maxY) {
      y = maxY;
    }
    this.y = y;
  }
  transform(opts = this) {
    this.setX(opts.x);
    this.setY(opts.y);
    this.angle = opts.angle;
    return this.el.attr('transform', `rotate(${this.angle} ${this.x} ${this.y}) translate(${this.x} ${this.y})`);
  }
  moveAbsolute(x, y) {
    let opts = {
      x: x,
      y: y
    };
    return this.transform(opts);
  }
  moveRelative(dx, dy) {
    let opts = {
      x: this.x + dx,
      y: this.y + dy,
      angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
    };
    return this.transform(opts);
  }
  dragging() {
    let drag = d3.drag().on('drag', () => {
      return this.moveRelative(d3.event.dx, d3.event.dy);
    });
    d3.selectAll('.player').call(drag);
  }
}

let players = [];
let player = new Player();
players.push(player);

let enemiesArray = _.range(0, gameOptions.nEnemies).map(val => {
  return {
    id: val,
    x: Math.random() * 100,
    y: Math.random() * 100
  };
});

let enemies = gameBoard.selectAll('enemies').data(enemiesArray, enemy => enemy.id).enter().append('svg:circle')
                                            .attr('class', 'enemies')
                                            .attr('cx', enemy => axes.x(enemy.x))
                                            .attr('cy', enemy => axes.y(enemy.y))
                                            .attr('r', 2);

enemies.exit().remove();
