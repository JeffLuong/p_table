import expect from 'expect.js';
import RemoteValue from './RemoteValue';

describe('RemoteValue', () => {
  describe('.loaded()', () => {
    it('is loaded', () => {
      const remote = new RemoteValue({
        isFetching: false,
        didEverLoad: true,
        didInvalidate: false,
        value: 'Loaded Value'
      });
      expect(remote.loaded()).to.be(true);
    });

    it('is not loaded - is fetching', () => {
      const remote = new RemoteValue({
        isFetching: true,
        didEverLoad: false,
        didInvalidate: false
      });
      expect(remote.loaded()).to.be(false);
    });

    it('is not loaded - has error', () => {
      const remote = new RemoteValue({
        isFetching: false,
        didEverLoad: false,
        didInvalidate: false,
        error: 'Oops!'
      });
      expect(remote.loaded()).to.be(false);
    });
  });
});