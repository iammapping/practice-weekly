const { expect } = require('chai');
const ReactiveVariables = require('./reactive-variables');

describe('2019 Aug Week4 Test: reactive-variables', () => {
  it('get right fn value', () => {
    const rv = new ReactiveVariables({
      a: 1,
      b: 2,
      c() {
        return this.a + this.b;
      },
    });
    expect(rv.a).to.be.equal(1);
    expect(rv.c).to.be.equal(3);
  });

  it('after mutate directive variable', () => {
    const rv = new ReactiveVariables({
      a: 1,
      b: 2,
      c() {
        return this.a + this.b;
      },
    });
    expect(rv.b).to.be.equal(2);
    expect(rv.c).to.be.equal(3);
    rv.b = 3;
    expect(rv.b).to.be.equal(3);
    expect(rv.c).to.be.equal(4);
  });

  it('always same without mutate dependence', () => {
    const rv = new ReactiveVariables({
      a: 1,
      b: 2,
      c() {
        return this.a + this.b;
      },
      d() {
        return {
          a: this.a,
          b: this.b,
          c: this.c,
        };
      },
      e: 'xx',
    });
    expect(rv.b).to.be.equal(2);
    expect(rv.c).to.be.equal(3);
    expect(rv.d).to.be.eql({a: 1, b: 2, c: 3});
    const od = rv.d;
    expect(rv.d).to.be.equal(od);
    // not mutate dependence
    rv.e = 'hh';
    expect(rv.d).to.be.equal(od);
  });

  it('after mutate dependence', () => {
    const rv = new ReactiveVariables({
      a: 1,
      b: 2,
      c() {
        return this.a + this.b;
      },
      d() {
        return {
          a: this.a,
          b: this.b,
          c: this.c,
        };
      },
    });
    expect(rv.b).to.be.equal(2);
    expect(rv.c).to.be.equal(3);
    expect(rv.d).to.be.eql({a: 1, b: 2, c: 3});
    const od = rv.d;
    expect(rv.d).to.be.equal(od);
    // mutate dependence
    rv.a = 2;
    expect(rv.c).to.be.equal(4);
    expect(rv.d).to.be.eql({a: 2, b: 2, c: 4});
    expect(rv.d).to.be.not.equal(od);
  });
});
