import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import injectScript from 'scriptjs';
import MapboxLoader from '../MapboxLoader';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('scriptjs');

describe('MapboxLoader', () => {
  const defaultProps = {
    accessToken: 'ACCESS_TOKEN',
  };

  const runAllMicroTasks = () => new Promise(resolve => setImmediate(resolve));

  it('expect to call Mapbox API', () => {
    const children = jest.fn(x => x);

    const props = {
      ...defaultProps,
    };

    shallow(<MapboxLoader {...props}>{children}</MapboxLoader>);

    return runAllMicroTasks().then(() => {
      expect(injectScript).toHaveBeenLastCalledWith(
        [
          'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js',
          'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css',
        ],
        expect.any(Function)
      );
    });
  });

  it('expect to call Google Maps API with a custom endpoint', () => {
    const children = jest.fn(x => x);

    const props = {
      ...defaultProps,
      endpoints: [
        'https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.js',
        'https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css',
      ],
    };

    shallow(<MapboxLoader {...props}>{children}</MapboxLoader>);

    return runAllMicroTasks().then(() => {
      expect(injectScript).toHaveBeenLastCalledWith(
        [
          'https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.js',
          'https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css',
        ],
        expect.any(Function)
      );
    });
  });

  it("expect to render nothing when it's loading", () => {
    const children = jest.fn(x => x);

    const props = {
      ...defaultProps,
    };

    const wrapper = shallow(<MapboxLoader {...props}>{children}</MapboxLoader>);

    expect(wrapper.type()).toBe(null);
    expect(children).not.toHaveBeenCalled();
  });

  it("expect to call children with the Mapboxgl object when it's loaded", () => {
    const children = jest.fn(x => x);

    const mapboxgl = {
      version: '1.9.1',
    };

    const props = {
      ...defaultProps,
    };

    injectScript.mockImplementationOnce((_, callback) => {
      global.mapboxgl = mapboxgl;
      callback();
    });

    const wrapper = shallow(<MapboxLoader {...props}>{children}</MapboxLoader>);

    return runAllMicroTasks().then(() => {
      expect(wrapper.type).not.toBe(null);
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(mapboxgl);

      delete global.google;
    });
  });

  it('expect to not call setState when we unmount before loading is complete', () => {
    const children = jest.fn(x => x);

    const props = {
      ...defaultProps,
    };

    let triggerLoadingComplete;
    injectScript.mockImplementationOnce((endpoint, callback) => {
      triggerLoadingComplete = callback;
    });

    const wrapper = shallow(<MapboxLoader {...props}>{children}</MapboxLoader>);

    return runAllMicroTasks().then(() => {
      expect(wrapper.type).not.toBe(null);
      expect(children).not.toHaveBeenCalled();

      wrapper.unmount();

      triggerLoadingComplete();

      expect(children).not.toHaveBeenCalled();
    });
  });
});
