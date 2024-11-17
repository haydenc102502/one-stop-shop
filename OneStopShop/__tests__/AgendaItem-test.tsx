/**
 * This file is used to test the AgendaItem and its resulting components.
 */

import React from 'react';
import { render, fireEvent, within } from '@testing-library/react-native';
import AgendaItem from '@/components/AgendaItem';
import { Alert } from 'react-native';

// Mock the Alert.alert function
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  buttons[1].onPress();
});

/* Test cases for the handleComplete function in the AgendaItem component. */
describe('AgendaItem', () => {
  const item = {
    id: '1',
    day: '2024-10-29',
    title: 'Test Event',
    description: 'This is a test event',
    completed: false,
  };

  it('should call onComplete with the correct time when handleComplete is called', () => {
    const onComplete = jest.fn();
    const { getByText } = render(<AgendaItem item={item} onComplete={onComplete} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    
    fireEvent.press(getByText('Complete'));
    
    expect(onComplete).toHaveBeenCalled();
    const completedTime = onComplete.mock.calls[0][0];
    expect(completedTime).toMatch(/\d{1,2}:\d{2}:\d{2} (AM|PM)/);
  });

  it('should display "Complete" button when item is not completed', () => {
    const { getByText } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    
    expect(getByText('Complete')).toBeTruthy();
  });

  it('should display "Uncomplete" button when item is completed', () => {
    const completedItem = { ...item, completed: true, completedTime: '10:00 AM' };
    const { getByText } = render(<AgendaItem item={completedItem} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    
    expect(getByText('Uncomplete')).toBeTruthy();
  });

  it('should not call onComplete if item is already completed', () => {
    const completedItem = { ...item, completed: true, completedTime: '10:00 AM' };
    const onComplete = jest.fn();
    const { getByText } = render(<AgendaItem item={completedItem} onComplete={onComplete} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    
    fireEvent.press(getByText('Uncomplete'));
    
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should call onComplete with the correct time format', () => {
    const onComplete = jest.fn();
    const { getByText } = render(<AgendaItem item={item} onComplete={onComplete} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    
    fireEvent.press(getByText('Complete'));
    
    expect(onComplete).toHaveBeenCalled();
    const completedTime = onComplete.mock.calls[0][0];
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;
    expect(timePattern.test(completedTime)).toBe(true);
  });
});

/* Test cases for the handleUpdate function in the AgendaItem component. */
describe('handleUpdate', () => {
  const item = {
    id: '1',
    day: '2024-10-29',
    title: 'Test Event',
    description: 'This is a test event',
    completed: false,
  };

  it('should call onUpdate with the correct updated data', () => {
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

  it('should open and close the modal correctly', () => {
    const { getByText, queryByText, getByTestId } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={jest.fn()} onUncomplete={jest.fn()} />);
    
    fireEvent.press(getByText('Update'));
    const modal = getByTestId('modal-container');
    expect(within(modal).getByText('Update Task')).toBeTruthy();
    
    fireEvent.press(within(modal).getByText('Cancel'));
    expect(queryByText('Update Task')).toBeNull();
  });

  it('should update the input fields correctly', () => {
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
});

/* Test cases for remove agenda item */
describe('removeAgendaItem', () => {
  const item = {
    id: '1',
    day: '2024-10-29',
    title: 'Test Event',
    description: 'This is a test event',
    completed: false,
  };

  it('should call onRemove when the "Remove" button is pressed', () => {
    const onRemove = jest.fn();
    const { getByText } = render(<AgendaItem item={item} onComplete={jest.fn()} onUpdate={jest.fn()} onRemove={onRemove} onUncomplete={jest.fn()} />);
    
    fireEvent.press(getByText('Remove'));
    
    expect(onRemove).toHaveBeenCalled();
  });
});