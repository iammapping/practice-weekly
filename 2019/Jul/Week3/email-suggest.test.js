const { expect } = require('chai');
const EmailSuggestion = require('./email-suggest');

const suggestedSuffixes = [
  '126.com',
  'qq.com',
  '163.com',
  'hotmail.com',
  'gmail.com',
  'mail.ru',
  'yahoo.com',
  'yahoo.cn',
];


describe('2019 Jul Week3 Test: email-suggest', () => {
  it('input correct', () => {
    const suggestion = new EmailSuggestion(suggestedSuffixes);
    const suggested = suggestion.suggest('xx@126.com');
    expect(suggested).to.be.an('array');
    expect(suggested[0]).to.be.equal('xx@126.com');
  });

  it('input with typo', () => {
    const suggestion = new EmailSuggestion(suggestedSuffixes);
    let suggested = suggestion.suggest('xx@126.con');
    expect(suggested).to.be.an('array');
    expect(suggested).has.length.greaterThan(0);
    expect(suggested[0]).to.be.equal('xx@126.com');

    suggested = suggestion.suggest('xx@125.com');
    expect(suggested).to.be.an('array');
    expect(suggested).has.length.greaterThan(0);
    expect(suggested[0]).to.be.equal('xx@126.com');

    suggested = suggestion.suggest('xx@125.co');
    expect(suggested).to.be.an('array');
    expect(suggested).has.length.greaterThan(0);
    expect(suggested[0]).to.be.equal('xx@126.com');
  });

  it('input with typo, more suggestions', () => {
    const suggestion = new EmailSuggestion(suggestedSuffixes);
    const suggested = suggestion.suggest('xx@yahoo.cc');
    expect(suggested).to.be.an('array');
    expect(suggested).has.length.greaterThan(1);
    expect(suggested).contains('xx@yahoo.com');
    expect(suggested).contains('xx@yahoo.cn');
  })
});
