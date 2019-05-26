const { expect } = require('chai');
const mergeCollection = require('./merge-collection');

describe('2019 May Week4 Test: merge-collection', () => {
  describe('two collection as array, one key', () => {
    const col1 = [
      { 'dim1': 'barney', 'met1': 123 },
      { 'dim1': 'fred', 'met1': 456 }
    ];

    const col2 = [
      { 'dim1': 'barney', 'met2': 111 },
      { 'dim1': 'fred', 'met2': 222 }
    ];

    it('merge by one string dim', () => {
      const mergedCol = mergeCollection('dim1', col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222 }
      ]);
    });

    it('merge by one [string] dim', () => {
      const mergedCol = mergeCollection(['dim1'], col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222 }
      ]);
    });

    it('merge by one function dim', () => {
      const mergedCol = mergeCollection((o) => o.dim1, col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222 }
      ]);
    });
  });

  describe('two collection as array, multiple keys', () => {
    const col1 = [
      { 'dim1': 'barney', 'dim2': '1', 'met1': 123 },
      { 'dim1': 'fred', 'dim2': '2', 'met1': 456 }
    ];

    const col2 = [
      { 'dim1': 'barney', 'dim2': '1', 'met2': 111 },
      { 'dim1': 'fred', 'dim2': '1', 'met2': 222 }
    ];

    it('merge by two [string, string] dims', () => {
      const mergedCol = mergeCollection(['dim1', 'dim2'], col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'dim2': '1', 'met1': 123, 'met2': 111 },
        { 'dim1': 'fred', 'dim2': '2', 'met1': 456 }
      ]);
    });

    it('merge by one function combile two dims', () => {
      const mergedCol = mergeCollection(o => o.dim1 + o.dim2, col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'dim2': '1', 'met1': 123, 'met2': 111 },
        { 'dim1': 'fred', 'dim2': '2', 'met1': 456 }
      ]);
    });
  });

  describe('two collection as array, multiple keys with conflict', () => {
    const col1 = [
      { 'dim1': 'barney,', 'dim2': '1', 'met1': 123 },
      { 'dim1': 'fred', 'dim2': '2', 'met1': 456 }
    ];

    const col2 = [
      { 'dim1': 'barney', 'dim2': ',1', 'met2': 111 },
      { 'dim1': 'fred', 'dim2': '1', 'met2': 222 }
    ];

    it('merge by two [string, string] dims', () => {
      const mergedCol = mergeCollection(['dim1', 'dim2'], col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney,', 'dim2': '1', 'met1': 123 },
        { 'dim1': 'fred', 'dim2': '2', 'met1': 456 }
      ]);
    });

    it('merge by one function combine two dims', () => {
      const mergedCol = mergeCollection(o => o.dim1 + o.dim2, col1, col2);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'dim2': ',1', 'met1': 123, 'met2': 111 },
        { 'dim1': 'fred', 'dim2': '2', 'met1': 456 }
      ]);
    });
  });

  describe('more collection as array, one key', () => {
    const col1 = [
      { 'dim1': 'barney', 'met1': 123 },
      { 'dim1': 'fred', 'met1': 456 }
    ];

    const col2 = [
      { 'dim1': 'barney', 'met2': 111 },
      { 'dim1': 'fred', 'met2': 222 }
    ];

    const col3 = [
      { 'dim1': 'barney', 'met3': 113 },
      { 'dim1': 'fred', 'met3': 223 }
    ];

    it('merge by one string dim', () => {
      const mergedCol = mergeCollection('dim1', col1, col2, col3);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111, 'met3': 113 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222, 'met3': 223 }
      ]);
    });

    it('merge by one [string] dim', () => {
      const mergedCol = mergeCollection(['dim1'], col1, col2, col3);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111, 'met3': 113 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222, 'met3': 223 }
      ]);
    });

    it('merge by one function dim', () => {
      const mergedCol = mergeCollection((o) => o.dim1, col1, col2, col3);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111, 'met3': 113 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222, 'met3': 223 }
      ]);
    });
  });

  describe('more collection as object, one key', () => {
    const col1 = {
      'barney': { 'dim1': 'barney', 'met1': 123 },
      'fred': { 'dim1': 'fred', 'met1': 456 }
    };

    const col2 = {
      'barney': { 'dim1': 'barney', 'met2': 111 },
      'fred': { 'dim1': 'fred', 'met2': 222 }
    };

    const col3 = {
      'barney': { 'dim1': 'barney', 'met3': 113 },
      'fred': { 'dim1': 'fred', 'met3': 223 }
    };

    it('merge by one string dim', () => {
      const mergedCol = mergeCollection('dim1', col1, col2, col3);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111, 'met3': 113 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222, 'met3': 223 }
      ]);
    });

    it('merge by one [string] dim', () => {
      const mergedCol = mergeCollection(['dim1'], col1, col2, col3);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111, 'met3': 113 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222, 'met3': 223 }
      ]);
    });

    it('merge by one function dim', () => {
      const mergedCol = mergeCollection((o) => o.dim1, col1, col2, col3);
      expect(mergedCol)
        .to.be.an('array')
        .and.has.lengthOf(2);
      expect(mergedCol).eql([
        { 'dim1': 'barney', 'met1': 123, 'met2': 111, 'met3': 113 },
        { 'dim1': 'fred', 'met1': 456, 'met2': 222, 'met3': 223 }
      ]);
    });
  });
});
