const { expect } = require('chai');
const RangeMap = require('./range-map');

describe('2019 Jul Week5 Test: range-map', () => {
  it('no intersection conflict', () => {
    const map = new RangeMap();
    map.add([1, 3], 'xxx');
    map.add([4, 7], 'yyy');

    expect(map.findRange(2)).to.be.eql([1, 3]);
    expect(map.findValue(2)).to.be.equal('xxx');
    expect(map.findRange(4)).to.be.eql([4, 7]);
    expect(map.findValue(4)).to.be.equal('yyy');
    expect(map.findRange(20)).to.be.undefined;
    expect(map.findValue(20)).to.be.undefined;

    map.clear();

    expect(map.findRange(2)).to.be.undefined;
  });

  it('with intersection conflict', () => {
    // 交集冲突，以后入为主
    const map = new RangeMap();
    map.add([1, 3], 'xxx');
    expect(map.findRange(2)).to.be.eql([1, 3]);

    map.add([3, 7], 'yyy');

    expect(map.findRange(2)).to.be.eql([1, 2]);
    expect(map.findValue(2)).to.be.equal('xxx');
    expect(map.findRange(4)).to.be.eql([3, 7]);
    expect(map.findValue(4)).to.be.equal('yyy');
    expect(map.findRange(3)).to.be.eql([3, 7]);
    expect(map.findValue(3)).to.be.equal('yyy');

    map.add([4, 5], 'zzz');
    expect(map.findRange(3)).to.be.eql([3, 3]);
    expect(map.findValue(3)).to.be.equal('yyy');
    expect(map.findRange(4)).to.be.eql([4, 5]);
    expect(map.findValue(4)).to.be.equal('zzz');
    expect(map.findRange(6)).to.be.eql([6, 7]);
    expect(map.findValue(6)).to.be.equal('yyy');
  });
});
