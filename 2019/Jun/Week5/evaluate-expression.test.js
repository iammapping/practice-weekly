const { expect } = require('chai');
const evaluate = require('./evaluate-expression');

describe('2019 Jun Week5 Test: evaluate-expression', () => {
  it('evaluate two values', () => {
    expect(evaluate('1 + 1')).to.be.eql(2);
    expect(evaluate('1+1')).to.be.eql(2);
    expect(evaluate('2 * 3')).to.be.eql(6);
  });

  it('evaluate multiple values without precedence modified', () => {
    expect(evaluate('10 + 2 * 6')).to.be.eql(22);
    expect(evaluate('100 * 2 + 12')).to.be.eql(212);
  });

  it('evaluate multiple values with precedence modified', () => {
    expect(evaluate('100 * ( 2 + 12 )')).to.be.eql(1400);
    expect(evaluate('100 * ( 2 + 12 ) / 14')).to.be.eql(100);
  });
});
