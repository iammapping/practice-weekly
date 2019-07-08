const { expect } = require('chai');
const SearchIndex = require('./search-index');

describe('2019 Jul Week1 Test: search-index', () => {
  describe('datum as string', () => {
    it('search by whitespace tokenizer', () => {
      const searchIndex = new SearchIndex();
      searchIndex.add(['dog', 'cat', 'og', 'd og']);

      expect(searchIndex.search('dog')).to.be.eql(['dog']);
      expect(searchIndex.search('do')).to.be.eql(['dog']);
      expect(searchIndex.search('og')).to.be.eql(['og', 'd og']);
      expect(searchIndex.search('d og')).to.be.eql(['d og']);
      expect(searchIndex.search('d        og')).to.be.eql(['d og']);
    });

    it('search by comma tokenizer', () => {
      const searchIndex = new SearchIndex({
        datumTokenizer: o => o.split(','),
        queryTokenizer: q => q.split(',')
      });
      searchIndex.add(['tag1,tag2', 'tag3,tag4', 'tag2,tag5']);

      expect(searchIndex.search('tag1')).to.be.eql(['tag1,tag2']);
      expect(searchIndex.search('tag2')).to.be.eql(['tag1,tag2', 'tag2,tag5']);
      expect(searchIndex.search('tagxx')).to.be.eql([]);
      expect(searchIndex.search('tag1,tag2,tag3')).to.be.eql([]);
    });
  });

  describe('datum as object', () => {
    it('search by whitespace tokenizer', () => {
      const searchIndex = new SearchIndex({
        identify: o => o.id,
        datumTokenizer: o => o.name.split(/\s+/)
      });
      searchIndex.add([
        {id: 1, name: 'dog'},
        {id: 2, name: 'cat'},
        {id: 3, name: 'og'},
        {id: 4, name: 'd og'}
      ]);

      expect(searchIndex.search('dog')).to.be.eql([{id: 1, name: 'dog'}]);
      expect(searchIndex.search('do')).to.be.eql([{id: 1, name: 'dog'}]);
      expect(searchIndex.search('og')).to.be.eql([{id: 3, name: 'og'}, {id: 4, name: 'd og'}]);
      expect(searchIndex.search('d og')).to.be.eql([{id: 4, name: 'd og'}]);
    });

    it('index by comma tokenizer, but search by whitespace tokenizer', () => {
      const searchIndex = new SearchIndex({
        identify: o => o.id,
        datumTokenizer: o => o.tags.split(','),
        queryTokenizer: q => q.split(/\s+/)
      });
      searchIndex.add([
        {id: 1, tags: 'tag1,tag2'},
        {id: 2, tags: 'tag3,tag4'},
        {id: 3, tags: 'tag2,tag5'}
      ]);

      expect(searchIndex.search('tag1')).to.be.eql([{id: 1, tags: 'tag1,tag2'}]);
      expect(searchIndex.search('tag2')).to.be.eql([{id: 1, tags: 'tag1,tag2'}, {id: 3, tags: 'tag2,tag5'}]);
      expect(searchIndex.search('tag3 tag4')).to.be.eql([{id: 2, tags: 'tag3,tag4'}]);
      expect(searchIndex.search('tag')).to.be.eql([{id: 1, tags: 'tag1,tag2'}, {id: 2, tags: 'tag3,tag4'}, {id: 3, tags: 'tag2,tag5'}]);
      expect(searchIndex.search('tagxx')).to.be.eql([]);
      expect(searchIndex.search('tag1 tag2 tag3')).to.be.eql([]);
    });
  });

  describe('datum as object, index with more attributes', () => {
    it('search by whitespace tokenizer', () => {
      const searchIndex = new SearchIndex({
        identify: o => o.id,
        datumTokenizer: o => [`n:${o.name}`, `s:${o.sound}`],
        queryTokenizer: q => q.split(' ').map(k => k.indexOf(':') > -1 ? k : `n:${k}`)
      });
      searchIndex.add([
        {id: 1, name: 'dog', sound: 'wang'},
        {id: 2, name: 'cat', sound: 'miao'},
        // tiger
        {id: 3, name: 'cat', sound: 'ao'},
        {id: 4, name: 'sheep', sound: 'mie'},
      ]);

      expect(searchIndex.search('dog')).to.be.eql([{id: 1, name: 'dog', sound: 'wang'}]);
      expect(searchIndex.search('wang')).to.be.eql([])
      expect(searchIndex.search('cat')).to.be.eql([{id: 2, name: 'cat', sound: 'miao'}, {id: 3, name: 'cat', sound: 'ao'}]);
      expect(searchIndex.search('n:cat s:ao')).to.be.eql([{id: 3, name: 'cat', sound: 'ao'}]);
      expect(searchIndex.search('s:mie')).to.be.eql([{id: 4, name: 'sheep', sound: 'mie'}]);
    });
  });
});
