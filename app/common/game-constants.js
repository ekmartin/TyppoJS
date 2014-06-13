module.exports = {
  WIDTH: 15,
  HEIGHT: 20,
  LEFT_WALL: 1,
  RIGHT_WALL: 1,
  BOTTOM_WALL: 1,
  START_RATE: 800,
  MIN_RATE: 400,
  TILE_SIZE: {
    x: 32,
    y: 32
  },
  getDropRate: function(totalDelta) {
    var rate = this.START_RATE - Math.pow(0.3*totalDelta, 2);
    return rate > this.MIN_RATE ? rate : this.MIN_RATE;
  }
};;
