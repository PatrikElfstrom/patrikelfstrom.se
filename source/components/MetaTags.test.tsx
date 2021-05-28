import TestRenderer from 'react-test-renderer';
import { MetaTags } from './MetaTags';

describe('<MetaTags />', () => {
  it('should match snapshot', () => {
    expect.assertions(1);
    const tree = TestRenderer.create(<MetaTags />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
