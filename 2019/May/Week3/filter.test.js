const { expect } = require('chai');
const filter = require('./filter');

describe('2019 May Week3 Test: filter', () => {
  describe('collection as array', () => {
    const users = [
      { user: 'barney', age: 36, active: true },
      { user: 'fred', age: 40, active: false },
    ];

    it('filter with function', () => {
      expect(filter(users, o => o.age > 50))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(users, o => !o.active)).eql([{ user: 'fred', age: 40, active: false }]);
    });

    it('filter with hash object', () => {
      expect(filter(users, {})).eql(users);
      expect(filter(users, { user: 'xxx' }))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(users, { user: 'fred' })).eql([{ user: 'fred', age: 40, active: false }]);
    });

    it('filter with key', () => {
      expect(filter(users, 'active')).eql([{ user: 'barney', age: 36, active: true }]);
      expect(filter(users, 'xxx'))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(users, 'age')).eql(users);
    });
  });

  describe('collection as object', () => {
    const users = {
      barney: { user: 'barney', age: 36, active: true },
      fred: { user: 'fred', age: 40, active: false },
    };

    it('filter with function', () => {
      expect(filter(users, o => o.age > 50))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(users, o => !o.active)).eql([{ user: 'fred', age: 40, active: false }]);
    });

    it('filter with hash object', () => {
      expect(filter(users, {})).eql(Object.values(users));
      expect(filter(users, { user: 'xxx' }))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(users, { user: 'fred' })).eql([{ user: 'fred', age: 40, active: false }]);
    });

    it('filter with key', () => {
      expect(filter(users, 'active')).eql([{ user: 'barney', age: 36, active: true }]);
      expect(filter(users, 'xxx'))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(users, 'age')).eql(Object.values(users));
    });
  });

  describe('collection as others', () => {
    it('filter with unexpected input arguments', () => {
      expect(filter())
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(null, 'xx'))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(null, null))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(123, 123))
        .to.be.an('array')
        .and.has.lengthOf(0);
      expect(filter(123, {active: true}))
        .to.be.an('array')
        .and.has.lengthOf(0);
    });
  });
});
