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
      expect(remote.loaded()).toBe(true);
    });

    it('is not loaded - is fetching', () => {
      const remote = new RemoteValue({
        isFetching: true,
        didEverLoad: false,
        didInvalidate: false
      });
      expect(remote.loaded()).toBe(false);
    });

    it('is not loaded - has error', () => {
      const remote = new RemoteValue({
        isFetching: false,
        didEverLoad: false,
        didInvalidate: false,
        error: 'Oops!'
      });
      expect(remote.loaded()).toBe(false);
    });
  });
});