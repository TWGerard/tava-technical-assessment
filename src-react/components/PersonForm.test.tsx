import { render } from '@testing-library/react';
import { MockedProvider } from "@apollo/client/testing/react";

import PersonForm from './PersonForm';

describe('PersonForm', () => {
  it('renders', async () => {
    const person = {};
    const onSubmit = () => { };

    const { asFragment } = render(
      <MockedProvider mocks={[]}>
        <PersonForm person={person} onSubmit={onSubmit} />
      </MockedProvider>
    );

    expect(asFragment).toMatchSnapshot();
  });
});
