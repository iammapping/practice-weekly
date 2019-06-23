const { expect } = require('chai');
const NavigatorHistory = require('./navigator-history');

describe('2019 Jun Week4 Test: navigator-history', () => {
  it('empty history', () => {
    const history = new NavigatorHistory();
    expect(history.current()).to.be.undefined;
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.false;
    expect(history.back()).to.be.undefined;
    expect(history.forward()).to.be.undefined;
  });

  it('history back', () => {
    const history = new NavigatorHistory();

    // | 1
    //   ^
    history.navigate(1);
    expect(history.current()).to.be.eql(1);
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.false;

    // | 1 2
    //     ^
    history.navigate(2);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.false;
    expect(history.current()).to.be.eql(2);

    // | 1 2
    //   ^
    expect(history.back()).to.be.eql(1);
    expect(history.current()).to.be.eql(1);
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.true;
  });

  it('history forward', () => {
    const history = new NavigatorHistory();
    // | 1
    //   ^
    history.navigate(1);
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.false;
    expect(history.forward()).to.be.undefined;

    // | 1 2
    //     ^
    history.navigate(2);

    // | 1 2
    //   ^
    expect(history.back()).to.be.eql(1);
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2
    //     ^
    expect(history.forward()).to.be.eql(2);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.false;
  });

  it('history back and forward', () => {
    const history = new NavigatorHistory();
    // | 1
    //   ^
    history.navigate(1);
    // | 1 2
    //     ^
    history.navigate(2);
    // | 1 2 3
    //       ^
    history.navigate(3);

    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.false;

    // | 1 2 3
    //     ^
    expect(history.back()).to.be.eql(2);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2 3
    //   ^
    expect(history.back()).to.be.eql(1);
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2 3
    //   ^
    expect(history.back()).to.be.undefined;
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2 3
    //     ^
    expect(history.forward()).to.be.eql(2);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.true;
  });

  it('history navigate after back or forward', () => {
    const history = new NavigatorHistory();
    // | 1
    //   ^
    history.navigate(1);
    // | 1 2
    //     ^
    history.navigate(2);
    // | 1 2 3
    //       ^
    history.navigate(3);

    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.false;

    // | 1 2 3
    //     ^
    expect(history.back()).to.be.eql(2);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2 4
    //       ^
    history.navigate(4);
    expect(history.current()).to.be.eql(4);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.false;

    // | 1 2 4
    //     ^
    expect(history.back()).to.be.eql(2);

    // | 1 2 4
    //   ^
    expect(history.back()).to.be.eql(1);
    expect(history.isBackAvailable()).to.be.false;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2 4
    //     ^
    expect(history.forward()).to.be.eql(2);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.true;

    // | 1 2 4
    //       ^
    expect(history.forward()).to.be.eql(4);
    expect(history.isBackAvailable()).to.be.true;
    expect(history.isForwardAvailable()).to.be.false;
  });
});
