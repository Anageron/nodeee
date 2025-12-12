function countDivisibleByThree(arr) {
  let count = 0;
  count = arr.filter((el) => el % 3 === 0).length;
  return count;
}

module.exports = { countDivisibleByThree };
