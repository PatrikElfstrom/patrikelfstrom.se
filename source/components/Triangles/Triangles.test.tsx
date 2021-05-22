import TestRenderer from 'react-test-renderer';
import { TriangleGrid } from './TriangleGrid';
import { Triangles } from './Triangles';

describe('<Triangles />', () => {
  it('should match snapshot', () => {
    const tree = TestRenderer.create(<Triangles />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
