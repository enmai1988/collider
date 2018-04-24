const gameOptions = {
  height: window.innerHeight - 120,
  width: window.innerWidth,
  nEnemies: 80,
  padding: 20
};

class Game {
  constructor({ width, height, nEnemies, padding }) {
    this.score = 0;
    this.bestScore = 0;
    this.width = width;
    this.height = height;
    this.nEnemies = nEnemies;
    this.padding = padding;
    this.gameBoard = this.makeGameBoard({ width, height });
    this.axes = this.scaleGameBoard({ width, height });
    this.updateScore(50);
    this.player = new Player({
      gameBoard: this.gameBoard,
      width,
      height,
      padding
    });
    this.enemies = new Enemies({
      nEnemies,
      axes: this.axes,
      gameBoard: this.gameBoard
    });
    d3.timer(this.checkCollision.bind(this));
  }

  makeGameBoard({ width, height }) {
    return d3
      .select('#main')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'gameBoard');
  }

  scaleGameBoard({ width, height }) {
    return {
      x: d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, width]),
      y: d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, height])
    };
  }

  checkCollision() {
    const radiusSum = this.player.r + Number(d3.select('.enemy').attr('r'));
    d3.selectAll('.enemy').each((datum, index, nodes) => {
      const enemy = d3.select(nodes[index]);
      const xDiff = this.player.x - enemy.attr('cx');
      const yDiff = this.player.y - enemy.attr('cy');
      const hypotenuse = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (hypotenuse <= radiusSum) {
        this.updateBestScore();
        this.score = 0;
      }
    });
  }

  updateScore(ms) {
    this.score++;
    d3.select('#current').text(this.score.toString());
    setTimeout(this.updateScore.bind(this), ms);
  }

  updateBestScore() {
    this.bestScore = Math.max(this.bestScore, this.score);
    return d3.select('#best').text(this.bestScore.toString());
  }
}

class Player {
  constructor({ gameBoard, width, height, padding }) {
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.path =
      'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.x = 0;
    this.y = 0;
    this.r = 5;
    this.angle = 0;
    this.fill = '#ff6600';
    this.el = gameBoard
      .append('svg:path')
      .attr('d', this.path)
      .attr('fill', this.fill)
      .attr('class', 'player');
    this.transform();
    this.dragging();
  }

  setX(x) {
    let minX = this.padding;
    let maxX = this.width - minX;
    if (x <= minX) {
      x = minX;
    } else if (x >= maxX) {
      x = maxX;
    }
    this.x = x;
  }

  setY(y) {
    let minY = this.padding;
    let maxY = this.height - minY;
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
    return this.el.attr(
      'transform',
      `rotate(${this.angle} ${this.x} ${this.y}) translate(${this.x} ${this.y})`
    );
  }

  movePlayer(dx, dy) {
    let opts = {
      x: this.x + dx,
      y: this.y + dy,
      angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
    };
    return this.transform(opts);
  }

  dragging() {
    let drag = d3.drag().on('drag', () => {
      return this.movePlayer(d3.event.dx, d3.event.dy);
    });
    d3.selectAll('.player').call(drag);
  }
}

class Enemies {
  constructor({ gameBoard, axes, nEnemies }) {
    this.enemisData = this.generateEnemies(nEnemies);
    this.renderEnemies({ gameBoard, axes });
    this.moveEnemies(axes);
  }

  generateEnemies(n) {
    return _.range(0, n).map(val => ({
      id: val,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
  }

  renderEnemies({ gameBoard, axes }) {
    let renderedEnemies = gameBoard
      .selectAll('.enemy')
      .data(this.enemisData, enemy => enemy.id)
      .enter()
      .append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', enemy => axes.x(enemy.x))
      .attr('cy', enemy => axes.y(enemy.y))
      .attr('r', 0);

    renderedEnemies.exit().remove();
  }

  moveEnemies(axes) {
    d3
      .selectAll('.enemy')
      .transition()
      .duration(2000)
      .attr('r', 5)
      .attr('cx', d => {
        d = axes.x(Math.random() * 100);
        return d;
      })
      .attr('cy', d => {
        d = axes.y(Math.random() * 100);
        return d;
      });

    setTimeout(this.moveEnemies.bind(this, axes), 2000);
  }
}

const game = new Game(gameOptions);
