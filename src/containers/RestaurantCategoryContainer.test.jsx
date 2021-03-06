import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategoryId } from '../actions';

import CATEGORIES from '../__fixtures__/categories.json';

import RestaurantCategoryContainer from './RestaurantCategoryContainer';

jest.mock('react-redux');
jest.mock('../services/api');

function renderComponent() {
  return render(<RestaurantCategoryContainer />);
}

describe('<RestaurantCategoryContainer />', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    useDispatch.mockImplementation(() => dispatch);
  });

  context('without categories', () => {
    beforeEach(() => {
      // Given
      useSelector.mockImplementation((selector) => selector({
        categories: [],
      }));
    });

    it('display no category-buttons', () => {
      const { container } = renderComponent();
      const categoryButtons = container.querySelector('#button-list').children;
      expect(categoryButtons.length).toEqual(0);
    });
  });

  context('with categories', () => {
    beforeEach(() => {
      // Given
      useSelector.mockImplementation((selector) => selector({
        categories: CATEGORIES,
      }));
    });

    it('display category-buttons', () => {
      const { container } = renderComponent();
      const categoryButtons = container.querySelector('#button-list').children;
      expect(categoryButtons.length).toEqual(CATEGORIES.length);
    });

    context('when click category-button', () => {
      it('change selected-category-id', () => {
        const { getAllByRole } = renderComponent();
        // When
        const categoryButtons = getAllByRole('button');
        categoryButtons.forEach((button, buttonIndex) => {
          fireEvent.click(button);
          // Then
          expect(dispatch).toBeCalledWith(setSelectedCategoryId(CATEGORIES[buttonIndex].id));
        });
      });
    });
  });
});
