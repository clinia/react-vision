import React from 'react';
import renderer from 'react-test-renderer';
import Hits from '../Hits';

describe('Hits', () => {
  type Props = { hit: any };

  const Hit = ({ hit }: Props) => <div id={hit.id} />;

  it('accepts a hit prop', () => {
    const hits = [{ id: '0' }, { id: '1' }, { id: '2' }];

    const tree = renderer.create(<Hits hit={Hit} hits={hits} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('accepts a custom className', () => {
    const hits = [{ id: '0' }, { id: '1' }, { id: '2' }];

    const tree = renderer.create(
      <Hits className="MyCustomHits" hit={Hit} hits={hits} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('shows loading indicator when loading prop is true', () => {
    const tree = renderer.create(<Hits loading={true} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
