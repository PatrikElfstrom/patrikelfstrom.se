import TestRenderer from 'react-test-renderer';
import { MetaTags } from './MetaTags';

describe('<MetaTags />', () => {
  it('should match snapshot', () => {
    const tree = TestRenderer.create(<MetaTags />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
