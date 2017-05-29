$(document).ready(function() {
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
                                    .attr('height', gameOptions.height);

  // Creates an array with objs
  // let createEnemies = function() {
  //   return _.range(0, gameOptions.nEnemies).map(val => {
  //     return {
  //       id: val,
  //       x: Math.random() * 100,
  //       y: Math.random() * 100
  //     };
  //   });
  // };

  let enemiesArray = _.range(0, gameOptions.nEnemies).map(val => {
    return {
      id: val,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });

  let enemies = gameBoard.selectAll('enemies').data(enemiesArray, d => d.id).enter().append('svg:circle')
                                              .attr('class', 'enemies')
                                              .attr('cx', d => d.x)
                                              .attr('cy', d => d.y)
                                              .attr('r', 5);    

});
