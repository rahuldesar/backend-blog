const listHelper = require('../utils/list_helper');

describe('dummy' ,() => {
  test('dummy returns one', () => {
    expect(listHelper.dummy([])).toBe(1);
  });

});