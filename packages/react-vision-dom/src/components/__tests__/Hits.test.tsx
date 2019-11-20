import React from 'react';
import renderer from 'react-test-renderer';
import Hits from '../Hits';

describe('Hits', () => {
  type Props = { record: any };

  const Hit = ({ record }: Props) => <div id={record.id} />;

  it('accepts a hit prop', () => {
    const records = [{ id: '0' }, { id: '1' }, { id: '2' }];

    const tree = renderer.create(<Hits hit={Hit} records={records} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('accepts a custom className', () => {
    const records = [{ id: '0' }, { id: '1' }, { id: '2' }];

    const tree = renderer.create(
      <Hits className="MyCustomHits" hit={Hit} records={records} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('shows loading indicator when loading prop is true', () => {
    const tree = renderer.create(<Hits loading={true} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
