module.exports = {
  WIDTH: 15,
  HEIGHT: 20,
  LEFT_WALL: 1,
  RIGHT_WALL: 1,
  BOTTOM_WALL: 1,
  START_RATE: 800,
  MIN_RATE: 400,
  getDropRate: function(totalDelta) {
    var rate = this.START_RATE - Math.pow(0.3*totalDelta, 2);
    return rate > MIN_RATE ? rate : MIN_RATE;
  }
};;
