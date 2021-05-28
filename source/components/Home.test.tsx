import TestRenderer from 'react-test-renderer';
import { Home } from './Home';

describe('<Home />', () => {
  it('should match snapshot', () => {
    expect.assertions(1);
    const tree = TestRenderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
