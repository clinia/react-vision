[![view on npm](http://img.shields.io/npm/v/react-vision.svg)](https://www.npmjs.org/package/react-vision)

# widgets
Widgets provide bare UI components to ease the integration Clinia's API suite inside a provider's application.

## Overview
All properties in the different modules are either optional or are provided with a default value. For further examples on how to use the different widgets, refer to the [examples](https://github.com/clinia/react-vision/tree/master/examples).

## Modules

<dl>
<dt><a href="#module_Configure">Configure</a></dt>
<dd></dd>
<dt><a href="#module_Index">Index</a></dt>
<dd></dd>
<dt><a href="#module_Vision">Vision</a></dt>
<dd></dd>
<dt><a href="#module_AutoComplete">AutoComplete</a></dt>
<dd></dd>
<dt><a href="#module_Hits">Hits</a></dt>
<dd></dd>
<dt><a href="#module_InfiniteHits">InfiniteHits</a></dt>
<dd></dd>
<dt><a href="#module_Location">Location</a></dt>
<dd></dd>
<dt><a href="#module_SearchBox">SearchBox</a></dt>
<dd></dd>
<dt><a href="#module_Control">Control</a></dt>
<dd></dd>
<dt><a href="#module_CustomMarker">CustomMarker</a></dt>
<dd></dd>
<dt><a href="#module_GeoSearch">GeoSearch</a></dt>
<dd></dd>
<dt><a href="#module_GoogleMapsLoader">GoogleMapsLoader</a></dt>
<dd></dd>
<dt><a href="#module_Marker">Marker</a></dt>
<dd></dd>
<dt><a href="#module_Redo">Redo</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LatLngPropType">LatLngPropType</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BoundingBoxPropType">BoundingBoxPropType</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GeolocHitPropType">GeolocHitPropType</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Configure"></a>

## Configure
<a name="exp_module_Configure--_default"></a>

<p>Configure is a widget that lets you provide raw search parameters
to the Clinia API.</p>
<p>This widget can be used either with react-dom and react-native. It will not render anything
on screen, only configure some parameters.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| queryType | <code>string</code> | <code>&quot;prefix_none&quot;</code> | <p>Sets the matching strategy for the search. Value is either <code>prefix_none</code> for complete word matching or <code>prefix_last</code> for partial word matching.</p> |
| perPage | <code>perPage</code> |  | <p>Sets the number of search results to return per page.</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision, Configure, Hits } from 'react-vision-dom';

const searchClient = cliniasearch(
  'TODO',
  'test'
);

const App = () => (
  <Vision
    searchClient={searchClient}
    indexName="health_facility"
  >
    <Configure perPage={5} queryType="prefix_last" />
    <Hits />
  </Vision>
);
```
<a name="module_Index"></a>

## Index
<a name="exp_module_Index--exports.IndexComponentWithoutContext"></a>

<p>The component that allows you to apply widgets to a dedicated index. It's
useful if you want to build an interface that targets multiple indices.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| indexName | <code>string</code> | <p>The name of the targeted index. Value is either <code>health_facility</code> or <code>professional</code>.</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision. Index, SearcbBox, Hits, Configure } from 'react-vision-dom';

const searchClient = cliniasearch(
 'TODO',
 'test'
);

const App = () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <Configure perPage={5} />
    <SearcbBox />
    <Index indexName="health_facility">
      <Hits />
    </Index>
    <Index indexName="professional">
      <Hits />
    </Index>
  </Vision>
);
```
<a name="module_Vision"></a>

## Vision
<a name="exp_module_Vision--Vision"></a>

<p><code>Vision</code> is the root component of all React Vision implementations.
It provides all the connected components (aka widgets) a means to interact
with the searchState.</p>

**Kind**: Exported widget  
**Requirements**: You will need to have an Clinia account to be able to use this widget.  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| createURL | <code>func</code> |  | <p>Function to call when creating links, useful for <a href="guide/Routing.html">URL Routing</a>.</p> |
| indexName | <code>string</code> |  | <p>Main index in which to search.</p> |
| onSearchStateChange | <code>func</code> |  | <p>Function to be called everytime a new search is done. Useful for <a href="guide/Routing.html">URL Routing</a>.</p> |
| refresh | <code>boolean</code> | <code>false</code> | <p>Flag to activate when the cache needs to be cleared so that the front-end is updated when a change occurs in the index.</p> |
| resultsState | <code>SearchResults</code> \| <code>Array.&lt;SearchResults&gt;</code> |  | <p>Use this to inject the results that will be used at first rendering. Those results are found by using the <code>findResultsState</code> function. Useful for <a href="guide/Server-side_rendering.html">Server Side Rendering</a>.</p> |
| root | <code>Object</code> |  | <p>Use this to customize the root element. Default value: <code>{ Root: 'div' }</code></p> |
| searchClient | <code>object</code> |  | <p>Provide a custom search client.</p> |
| searchState | <code>object</code> |  | <p>Object to inject some search state. Switches the Vision component in controlled mode. Useful for <a href="guide/Routing.html">URL Routing</a>.</p> |
| stalledSearchDelay | <code>number</code> | <code>200</code> | <p>The amount of time before considering that the search takes too much time. The time is expressed in milliseconds.</p> |

<a name="module_AutoComplete"></a>

## AutoComplete
<a name="exp_module_AutoComplete--_default"></a>

<p>The AutoComplete component displays a search box that lets the user search for a specific query.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Set autoFocus to the autocomplete input.</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the AutoComplete form container.</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title.</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| highlightPostTag | <code>string</code> |  | <p>The post tag that will highlight the matched part of the query in each suggestion. Usually a html tag like <code>&lt;/strong&gt;</code>.</p> |
| highlightPreTag | <code>string</code> |  | <p>The pre tag that will highlight the matched part of the query in each suggestion. Usually a html tag like <code>&lt;strong&gt;</code>.</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the AutoComplete form container.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the AutoComplete form container.</p> |
| onSuggestionSelected | <code>function</code> |  | <p>Executes every time that a suggestion is selected.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder.</p> |
| renderSuggestion | <code>function</code> |  | <p>Define how suggestions will be rendered.</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title.</p> |
| size | <code>number</code> | <code>5</code> | <p>Number of suggestions to show.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <InstantSearch>. By default, the value is 200ms.</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to the AutoComplete form container.</p> |
| triggerSubmitOnSuggestionSelected | <code>boolean</code> | <code>false</code> | <p>Define if the AutoComplete form container should be submitted onSuggestionSelected.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-AutoComplete | <p>The root div of the widget.</p> |
| cvi-AutoComplete-clear | <p>The reset button used to clear the content of the input.</p> |
| cvi-AutoComplete-clearIcon | <p>The default reset icon used inside the reset button.</p> |
| cvi-AutoComplete-form | <p>The wrapping form.</p> |
| cvi-AutoComplete-input | <p>The search input.</p> |
| cvi-AutoComplete-loadingIcon | <p>The default loading icon.</p> |
| cvi-AutoComplete-loadingIndicator | <p>The loading indicator container.</p> |
| cvi-AutoComplete-submit | <p>The submit button.</p> |
| cvi-AutoComplete-submitIcon | <p>The default magnifier icon used with the search input.</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision, AutoComplete } from 'react-vision-dom';

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App = () => (
  <Vision
    searchClient={searchClient}
  >
    <AutoComplete />
  </Vision>
);
```
<a name="module_Hits"></a>

## Hits
<a name="exp_module_Hits--_default"></a>

<p>Displays a list of hits.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | <p>Add a custom CSS class to the component.</p> |
| emptySearch | <code>string</code> | <p>The text shown on empty results.</p> |
| hitComponent | <code>Component</code> | <p>Component used for rendering each hit from the results. If it is not provided the rendering defaults to displaying the hit in its JSON form. The component will be called with a <code>record</code> prop.</p> |
| noResultsFound | <code>node</code> | <p>Change the apparence of the default empty results found.</p> |
| style | <code>object</code> | <p>Add a custom React.CSSProperties object to the Hits container.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-Hits | <p>The root div of the widget.</p> |
| cvi-Hits-item | <p>The hit list item</p> |
| cvi-Hits-list | <p>The list of results.</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision, Hits } from 'react-vision-dom';

const searchClient = cliniasearch(
  'TODO',
  'test'
);
const App = () => (
  <Vision
    searchClient={searchClient}
    indexName="health_facility"
  >
    <Hits />
  </Vision>
);
```
<a name="module_InfiniteHits"></a>

## InfiniteHits
<a name="exp_module_InfiniteHits--_default"></a>

<p>Displays an infinite list of hits along with a <strong>load more</strong> button.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| className | <code>string</code> |  | <p>Add a custom CSS class to the component.</p> |
| hitComponent | <code>Component</code> |  | <p>Component used for rendering each record from the results. If it is not provided the rendering defaults to displaying the record in its JSON form. The component will be called with a <code>record</code> prop.</p> |
| loadMore | <code>string</code> |  | <p>The label of load more button.</p> |
| loadPrevious | <code>string</code> |  | <p>The label of load previous button.</p> |
| showPrevious | <code>boolean</code> | <code>false</code> | <p>Define if button of <code>load previous</code> should be shown.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-InfiniteHits | <p>The root div of the widget</p> |
| cvi-InfiniteHits-item | <p>The hit list item</p> |
| cvi-InfiniteHits-list | <p>The list of hits</p> |
| cvi-InfiniteHits-loadMore | <p>The button used to display more results</p> |
| cvi-InfiniteHits-loadMore--disabled | <p>The disabled button used to display more results</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision, InfiniteHits } from 'react-vision-dom';

const searchClient = cliniasearch(
  'TODO',
  'test'
);

const App = () => (
  <Vision
    searchClient={searchClient}
    indexName="health_facility"
  >
    <InfiniteHits />
  </Vision>
);
```
<a name="module_Location"></a>

## Location
<a name="exp_module_Location--Location"></a>

<p>The Location component displays a search box that lets the user search for a specific location.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Set autoFocus to the autocomplete input</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the Location form container</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title</p> |
| country | <code>string</code> |  | <p>Filter the suggestion to the given country codes. (The countries values must be formatted according to the ISO 3166, e.g. &quot;CA&quot;).</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| limit | <code>number</code> | <code>5</code> | <p>Define the limit number for the presented suggestions.</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| locale | <code>string</code> | <code>&quot;en&quot;</code> | <p>Define the language for the presented suggestions (The locale value must be formatted according to the ISO 639, e.g. 'en').</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the Location form container.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the Location form container.</p> |
| onSuggestionSelected | <code>function</code> |  | <p>Executes every time that a suggestion is selected.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder</p> |
| renderSuggestion | <code>function</code> |  | <p>Define how suggestions will be rendered.</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <InstantSearch>. By default, the value is 200ms.</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to the Location form container</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| triggerSubmitOnSuggestionSelected | <code>boolean</code> | <code>false</code> | <p>Define if the Location form container should be submitted onSuggestionSelected</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-Location | <p>The root div of the widget.</p> |
| cvi-Location-clear | <p>The reset button used to clear the content of the input.</p> |
| cvi-Location-clearIcon | <p>The default reset icon used inside the reset button.</p> |
| cvi-Location-form | <p>The wrapping form.</p> |
| cvi-Location-input | <p>The search input.</p> |
| cvi-Location-loadingIcon | <p>The default loading icon.</p> |
| cvi-Location-loadingIndicator | <p>The loading indicator container.</p> |
| cvi-Location-submit | <p>The submit button.</p> |
| cvi-Location-submitIcon | <p>The default magnifier icon used with the search input.</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision, Location } from 'react-vision-dom';

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App = () => (
  <Vision
    searchClient={searchClient}
  >
    <Location />
  </Vision>
);
```
<a name="module_SearchBox"></a>

## SearchBox
<a name="exp_module_SearchBox--_default"></a>

<p>The SearchBox component displays a search box that lets the user search for a specific query.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Should the search box be focused on render?</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the SearchBox form container.</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title.</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| focusShortcuts | <code>Array.&lt;string&gt;</code> | <code>[&#x27;s&#x27;,&#x27;/&#x27;</code> | <p>List of keyboard shortcuts that focus the search box. Accepts key names and key codes.</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the SearchBox form container.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the SearchBox form container.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder.</p> |
| searchAsYouType | <code>boolean</code> | <code>true</code> | <p>Should we search on every change to the query? If you disable this option, new searches will only be triggered by clicking the search button or by pressing the enter key while the search box is focused.</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <InstantSearch>. By default, the value is 200ms.</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to SearchBox form container.</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-SearchBox | <p>The root div of the widget.</p> |
| cvi-SearchBox-clear | <p>The reset button used to clear the content of the input.</p> |
| cvi-SearchBox-clearIcon | <p>The default reset icon used inside the reset button.</p> |
| cvi-SearchBox-form | <p>The wrapping form.</p> |
| cvi-SearchBox-input | <p>The search input.</p> |
| cvi-SearchBox-loadingIndicator | <p>The loading indicator container.</p> |
| cvi-SearchBox-loadingIcon | <p>The default loading icon.</p> |
| cvi-SearchBox-submit | <p>The submit button.</p> |
| cvi-SearchBox-submitIcon | <p>The default magnifier icon used with the search input.</p> |

**Example**  
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vision, SearchBox } from 'react-vision-dom';

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App = () => (
  <Vision
    searchClient={searchClient}
  >
    <SearchBox />
  </Vision>
);
```
<a name="module_Control"></a>

## Control
<a name="exp_module_Control--exports.Control"></a>

<p>Control to enable, disable or to manually trigger a search on map movement.</p>

**Kind**: Exported widget  
**Themes**

| Name | Description |
| --- | --- |
| cvi-GeoSearch-control | <p>The root div of the Control.</p> |
| cvi-GeoSearch-label | <p>The label of the checkbox.</p> |
| cvi-GeoSearch-input | <p>The checkbox.</p> |
| cvi-GeoSearch-redo | <p>The re-search button.</p> |

**Example**  
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ records }) => (
        <Fragment>
          <Control />
          {records.map(record => (
            <Marker
              key={record.id}
              record={record}
            />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_CustomMarker"></a>

## CustomMarker
<a name="exp_module_CustomMarker--exports.CustomMarker"></a>

<p>Allow the creation a custom map marker.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| anchor | <code>Object</code> | <p>The anchor of the marker.</p> |
| className | <code>string</code> | <p>Classname for the custom marker.</p> |
| label | <code>string</code> | <p>Label to display.</p> |
| on* | <code>function</code> | <p>Listen to any mouse events sent from the marker.</p> |
| record | [<code>GeolocHitPropType</code>](#GeolocHitPropType) | <p>Record to display.</p> |

**Example**  
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ records }) => (
        <Fragment>
          {records.map(record => (
             <CustomMarker
               key={record.id}
               record={record}
               anchor={{ x: 5, y: 0 }}
               onMouseEnter={() => {}}
               onMouseLeave={() => {}}
             >
               <div className={classNames.join(' ').trim()}>
                 <span>{record.name}</span>
               </div>
             </CustomMarker>
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_GeoSearch"></a>

## GeoSearch
<a name="exp_module_GeoSearch--module.exports"></a>

<p>Map component to display search results.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| defaultRefinement | [<code>BoundingBoxPropType</code>](#BoundingBoxPropType) | <p>The default bounds of the map.</p> |
| enableRefine | <code>boolean</code> | <p>If the refinement is enabled at all for the map.</p> |
| enableRefineOnMapMove | <code>boolean</code> | <p>If the map should trigger a new search on map movement.</p> |
| google | <code>Object</code> | <p>The google client.</p> |
| initialPosition | [<code>LatLngPropType</code>](#LatLngPropType) | <p>The initial position of the map.</p> |
| initialZoom | <code>number</code> | <p>The initial zoom value.</p> |

<a name="module_GoogleMapsLoader"></a>

## GoogleMapsLoader
<a name="exp_module_GoogleMapsLoader--GoogleMapsLoader"></a>

<p>Instantiate an instance of the Google maps client on the client side.
Since this component rely on the <code>document</code> property, this won't be run on the server during any <a href="guide/Server-side_rendering.html">Server Side Rendering</a> phase.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | <p>Your Google maps api key.</p> |
| endpoint | <code>string</code> | <code>&quot;https://maps.googleapis.com/maps/api/js?v&#x3D;quarterly&quot;</code> | <p>The default endpoint to get the maps from.</p> |

**Example**  
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch
      google={google}
      defaultRefinement={{
        northEast: { lat: 45.7058381, lng: -73.47426 },
        southWest: { lat: 45.410246, lng: -73.986345 },
      }}
    >
      {({ records }) => (
        <Fragment>
          {records.map(record => (
            <Marker key={record.id} record={record} />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_Marker"></a>

## Marker
<a name="exp_module_Marker--exports.Marker"></a>

<p>Map marker.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| record | [<code>GeolocHitPropType</code>](#GeolocHitPropType) | <p>Record to display.</p> |
| label | <code>string</code> | <p>Label to display.</p> |
| on* | <code>function</code> | <p>Listen to any mouse events sent from the marker.</p> |

**Example**  
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ records }) => (
        <Fragment>
          {records.map(record => (
            <Marker
              key={record.id}
              record={record}
              label={record.name}
              onClick={() => {}}
              onDoubleClick={() => {}}
            />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_Redo"></a>

## Redo
<a name="exp_module_Redo--exports.Redo"></a>

<p>Button that indicate triggers a search when clicked.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| translate | <code>function</code> | <p>Should return the text to display in the button.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-GeoSearch-control | <p>The root div of the Control.</p> |
| cvi-GeoSearch-redo | <p>The re-search button.</p> |
| cvi-GeoSearch-redo--disabled | <p>The re-search button while disabled.</p> |

**Example**  
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ records }) => (
        <Fragment>
          <Redo />
          {records.map(record => (
            <Marker
              key={record.id}
              record={record}
            />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="LatLngPropType"></a>

## LatLngPropType : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lat | <code>number</code> | <p>Latitude (-90 to 90).</p> |
| lng | <code>number</code> | <p>Longitude (-180 tp 180).</p> |

<a name="BoundingBoxPropType"></a>

## BoundingBoxPropType : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| northEast | [<code>LatLngPropType</code>](#LatLngPropType) | <p>NorthEast coordinate descibing the bounds.</p> |
| southWest | [<code>LatLngPropType</code>](#LatLngPropType) | <p>SouthWest coordinate descibing the bounds.</p> |

<a name="GeolocHitPropType"></a>

## GeolocHitPropType : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| geoPoint | [<code>LatLngPropType</code>](#LatLngPropType) | <p>Coordinate of the hit.</p> |

