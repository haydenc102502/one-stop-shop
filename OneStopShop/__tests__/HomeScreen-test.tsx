// TODO: Remove this file when more unit tests are set up
import HomeScreen from '@/components';
import { render } from '@testing-library/react-native';


describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    const { getByText } = render(<HomeScreen />);

    getByText('Welcome!');
  });
});