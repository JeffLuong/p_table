import { Record } from 'immutable';

export interface RemoteProps {
  isFetching: boolean;
  didInvalidate: boolean;
  didEverLoad: boolean;
  value?: any;
  error: string;
}

export const defaultRemoteProps: RemoteProps = {
  isFetching: false,
  didInvalidate: false,
  didEverLoad: false,
  value: undefined,
  error: ''
}

/**
 * Passing in `RecType` into `RemoteValue` as a type arg because it'd be nice to see
 * what kind of type is being held within the RemoteValue itself.
 *
 * Example:
 * const fetchedData = RemoteValue<User>
 */

class RemoteValue<RecType> extends Record(defaultRemoteProps) implements RemoteProps {
  public constructor(props?: Partial<RemoteProps>) {
    super(props || defaultRemoteProps);
  }

  loaded(): boolean {
    return !this.isFetching && !this.didEverLoad && !this.error;
  }
}

export default RemoteValue;