import React from 'react';
import { render, fireEvent, within } from '@testing-library/react-native';
import AgendaItem from '@/components/AgendaItem';
import { Alert } from 'react-native';
import { CalendarEntryCategory } from '@/data-store/calendarEntryCategory';
import { Text } from 'react-native';

// Mock the Alert.alert function
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons[1]) {
    buttons[1].onPress();
  }
});

// Mock the Icon component
jest.mock('react-native-vector-icons/FontAwesome', () => {
  const { Text } = require('react-native');
  return (props) => {
    return <Text testID="icon" {...props}>{props.name}</Text>;
  };
});

describe('AgendaItem', () => {
  const item = {
    id: '1',
    day: '2024-10-29',
    title: 'Test Event',
    description: 'This is a test event',
    completed: false,
  };

  it('should call onComplete with the correct time format', () => {
    const onComplete = jest.fn();
    const { getByText } = render(<AgendaItem item={item} onComplete={onComplete} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Complete'));
    expect(onComplete).toHaveBeenCalled();
    const completedTime = onComplete.mock.calls[0][0];
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;
    expect(timePattern.test(completedTime)).toBe(true);
  });

  it('should call onRemove when the "Remove" button is pressed', () => {
    const onRemove = jest.fn();
    const { getByText } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={onRemove} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Remove'));
    expect(onRemove).toHaveBeenCalled();
  });

  it('should render "No Events Planned Today" when item is empty', () => {
    const emptyItem = {};
    const { getByText } = render(<AgendaItem item={emptyItem} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    expect(getByText('No Events Planned Today')).toBeTruthy();
  });

  it('should call onUpdate with the correct updated data when handleUpdate is called', () => {
    const onUpdate = jest.fn();
    const { getByText, getByPlaceholderText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={onUpdate} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    const titleInput = within(modal).getByPlaceholderText('Title');
    fireEvent.changeText(titleInput, 'Updated Event');
    const descriptionInput = within(modal).getByPlaceholderText('Description');
    fireEvent.changeText(descriptionInput, 'Updated description');
    const dayInput = within(modal).getByPlaceholderText('Day (e.g., 2024-10-29)');
    fireEvent.changeText(dayInput, '2024-11-01');
    const hourInput = within(modal).getByPlaceholderText('Hour');
    fireEvent.changeText(hourInput, '11:00 AM');
    const durationInput = within(modal).getByPlaceholderText('Duration');
    fireEvent.changeText(durationInput, '2 hours');
    fireEvent.press(within(modal).getByText('Update'));
    expect(onUpdate).toHaveBeenCalledWith({
      title: 'Updated Event',
      day: '2024-11-01',
      time: '11:00 AM',
      duration: '2 hours',
      description: 'Updated description',
      calendarEntryCategory: item.calendarEntryCategory,
    });
  });

  it('should handle empty description in handlePress', () => {
    const itemWithoutDescription = { ...item, description: undefined };
    const { getByText } = render(<AgendaItem item={itemWithoutDescription} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText(itemWithoutDescription.title));
    expect(Alert.alert).toHaveBeenCalledWith('Task Description', 'No Description');
  });

  it('should update the input fields correctly when handleUpdate is called', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    const titleInput = within(modal).getByPlaceholderText('Title');
    fireEvent.changeText(titleInput, 'Updated Event');
    expect(titleInput.props.value).toBe('Updated Event');
    const descriptionInput = within(modal).getByPlaceholderText('Description');
    fireEvent.changeText(descriptionInput, 'Updated description');
    expect(descriptionInput.props.value).toBe('Updated description');
    const dayInput = within(modal).getByPlaceholderText('Day (e.g., 2024-10-29)');
    fireEvent.changeText(dayInput, '2024-11-01');
    expect(dayInput.props.value).toBe('2024-11-01');
    const hourInput = within(modal).getByPlaceholderText('Hour');
    fireEvent.changeText(hourInput, '11:00 AM');
    expect(hourInput.props.value).toBe('11:00 AM');
    const durationInput = within(modal).getByPlaceholderText('Duration');
    fireEvent.changeText(durationInput, '2 hours');
    expect(durationInput.props.value).toBe('2 hours');
  });

  it('should display the modal when modalVisible is true', () => {
    const { getByText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    expect(modal.props.visible).toBe(true);
  });

  it('should close the modal when cancel button is pressed', () => {
    const { getByText, queryByText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    expect(within(modal).getByText('Update Task')).toBeTruthy();
    fireEvent.press(within(modal).getByText('Cancel'));
    expect(queryByText('Update Task')).toBeNull();
  });

  it('should render the correct icon based on category', () => {
    const categories = [
      { category: CalendarEntryCategory.ANNOUNCEMENT, expectedIcon: 'bullhorn' },
      { category: CalendarEntryCategory.GRADES, expectedIcon: 'calculator' },
      { category: CalendarEntryCategory.ASSIGNMENT, expectedIcon: 'newspaper-o' },
      { category: undefined, expectedIcon: 'calendar' },
    ];

    categories.forEach(({ category, expectedIcon }) => {
      const categoryItem = { ...item, calendarEntryCategory: category };
      const { getByTestId } = render(<AgendaItem item={categoryItem} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
      const icon = getByTestId('icon');
      const iconName = icon.props.children;
      expect(iconName).toBe(expectedIcon);
    });
  });

  it('should update the category when a new category is selected', () => {
    const onUpdate = jest.fn();
    const { getByText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={onUpdate} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    const categoryButton = within(modal).getByText(CalendarEntryCategory.GRADES);
    fireEvent.press(categoryButton);
    fireEvent.press(within(modal).getByText('Update'));
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ calendarEntryCategory: CalendarEntryCategory.GRADES }));
  });

  it('should show alert with task description when item is not completed', () => {
    const { getByText } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText(item.title));
    expect(Alert.alert).toHaveBeenCalledWith('Task Description', item.description || 'No Description');
  });

  it('should show alert with completion time when item is completed', () => {
    const completedItem = { ...item, completed: true, completedTime: '10:00 AM' };
    const { getByText } = render(<AgendaItem item={completedItem} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText(completedItem.title));
    expect(Alert.alert).toHaveBeenCalledWith('Task Completed', `${completedItem.title}\nCompleted at: ${completedItem.completedTime}`);
  });

  it('should call onUncomplete when "Uncomplete" button is pressed', () => {
    const completedItem = { ...item, completed: true, completedTime: '10:00 AM' };
    const onUncomplete = jest.fn();
    const { getByText } = render(<AgendaItem item={completedItem} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={onUncomplete} />);
    fireEvent.press(getByText('Uncomplete'));
    expect(onUncomplete).toHaveBeenCalled();
  });

  it('should truncate description correctly', () => {
    const longDescriptionItem = { ...item, description: 'This is a very long description that needs to be truncated' };
    const { getByText } = render(<AgendaItem item={longDescriptionItem} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    expect(getByText('This is a ...')).toBeTruthy();
  });

  it('should close the modal when onRequestClose is called', () => {
    const { getByText, queryByText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    expect(modal.props.visible).toBe(true);
    fireEvent(modal, 'requestClose');
    expect(queryByText('Update Task')).toBeNull();
  });
});