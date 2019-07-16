const { expect } = require('chai');
const LRU = require('./lru-cache');

describe('2019 Jul Week2 Test: lru-cache', () => {
  it('simple test get', () => {
    const cache = new LRU(10);
    cache.set('key', 'value');
    expect(cache.get('key')).to.be.equal('value');
    expect(cache.get('none')).to.be.undefined;
    expect(cache.length).to.be.equal(1);
  });

  it('set hitting max capacity', () => {
    const cache = new LRU(2);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.set('c', 'C');
    expect(cache.get('c')).to.be.equal('C');
    expect(cache.get('b')).to.be.equal('B');
    expect(cache.get('a')).to.be.undefined;
  });

  it('lru get', () => {
    const cache = new LRU(2);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.get('a');
    cache.set('c', 'C');
    expect(cache.get('c')).to.be.equal('C');
    expect(cache.has('b')).to.be.false;
    expect(cache.get('b')).to.be.undefined;
    expect(cache.get('a')).to.be.equal('A');
  });

  it('lru set', () => {
    const cache = new LRU(2);
    cache.set('foo', 1);
    cache.set('bar', 2);
    cache.del('bar');
    cache.set('baz', 3);
    cache.set('qux', 4);
    expect(cache.get('foo')).to.be.undefined;
    expect(cache.get('bar')).to.be.undefined;
    expect(cache.get('baz')).to.be.equal(3);
    expect(cache.get('qux')).to.be.equal(4);
  });

  it('lru so many get and set', () => {
    const cache = new LRU(100);
    let i;
    for (i = 0; i < 100; i++) {
      cache.set(i, i);
    }
    expect(cache.length).to.be.equal(100);
    for (i = 0; i < 100; i++) {
      expect(cache.get(i)).to.be.equal(i);
    }
    cache.reset();
    for (i = 0; i < 100; i++) {
      expect(cache.get(i)).to.be.undefined;
    }
  });
});
