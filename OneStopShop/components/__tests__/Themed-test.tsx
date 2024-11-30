import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text, View } from '../Themed';
import * as useColorSchemeModule from '../useColorScheme';

jest.mock('../useColorScheme');

describe('Themed components', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Text component renders correctly', () => {
    const tree = renderer.create(<Text>Snapshot test for Text!</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('View component renders correctly', () => {
    const tree = renderer.create(<View><Text>Snapshot test for View!</Text></View>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Text component uses lightColor prop when provided', () => {
    const tree = renderer.create(<Text lightColor="red">Test with lightColor</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('View component uses darkColor prop when provided', () => {
    const tree = renderer.create(<View darkColor="blue"><Text>Test with darkColor</Text></View>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Text component uses default theme when useColorScheme returns null', () => {
    (useColorSchemeModule.useColorScheme as jest.Mock).mockReturnValue(null);
    const tree = renderer.create(<Text>Test with default theme</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Text component uses light theme when useColorScheme returns light', () => {
    (useColorSchemeModule.useColorScheme as jest.Mock).mockReturnValue('light');
    const tree = renderer.create(<Text>Test with light theme</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});