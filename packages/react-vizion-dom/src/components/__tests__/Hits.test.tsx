import React from 'react';
import renderer from 'react-test-renderer';
import Hits from '../Hits';

describe('Hits', () => {
  type Props = { hit: any };

  const Hit = ({ hit }: Props) => <div id={hit.id} />;

  it('accepts a hitComponent prop', () => {
    const hits = [{ id: 0 }, { id: 1 }, { id: 2 }];

    const tree = renderer.create(<Hits hitComponent={Hit} hits={hits} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('accepts a custom className', () => {
    const hits = [{ id: 0 }, { id: 1 }, { id: 2 }];

    const tree = renderer.create(
      <Hits className="MyCustomHits" hitComponent={Hit} hits={hits} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
