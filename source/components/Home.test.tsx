import TestRenderer from 'react-test-renderer';
import { Home } from './Home';

describe('<Home />', () => {
  it('should match snapshot', () => {
    const tree = TestRenderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
