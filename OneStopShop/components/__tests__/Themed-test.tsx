import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text, View } from '../Themed';

describe('Themed components', () => {
  it('Text component renders correctly', () => {
    const tree = renderer.create(<Text>Snapshot test for Text!</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('View component renders correctly', () => {
    const tree = renderer.create(<View><Text>Snapshot test for View!</Text></View>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});