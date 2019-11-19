[![view on npm](http://img.shields.io/npm/v/react-vision.svg)](https://www.npmjs.org/package/react-vision)

# widgets
Widgets provide bare UI components to ease the integration Clinia's API suite inside a provider's application.

## Modules

<dl>
<dt><a href="#module_Autocomplete">Autocomplete</a></dt>
<dd></dd>
<dt><a href="#module_Hits">Hits</a></dt>
<dd></dd>
<dt><a href="#module_InfiniteHits">InfiniteHits</a></dt>
<dd></dd>
<dt><a href="#module_Location">Location</a></dt>
<dd></dd>
<dt><a href="#module_SearchBox">SearchBox</a></dt>
<dd></dd>
</dl>

<a name="module_Autocomplete"></a>

## Autocomplete
<a name="exp_module_Autocomplete--_default"></a>

<p>The AutoComplete component displays a search box that lets the user search for a specific query.</p>

**Kind**: Exported widget  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| renderSuggestion | <code>function</code> |  | <p>Define how suggestions will be rendered</p> |
| onSuggestionSelected | <code>function</code> |  | <p>Executes every time that a suggestion is selected</p> |
| triggerSubmitOnSuggestionSelected | <code>boolean</code> | <code>false</code> | <p>Define if the AutoComplete form container should be submitted onSuggestionSelected</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the AutoComplete form container.</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the AutoComplete form container.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <InstantSearch>. By default, the value is 200ms.</p> |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Set autoFocus to the autocomplete input</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the AutoComplete form container</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to the AutoComplete form container</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-AutoComplete | <p>The root div of the widget</p> |
| cvi-AutoComplete-form | <p>The wrapping form</p> |
| cvi-AutoComplete-input | <p>The search input</p> |
| cvi-AutoComplete-submit | <p>The submit button</p> |
| cvi-AutoComplete-submitIcon | <p>The default magnifier icon used with the search input</p> |
| cvi-AutoComplete-clear | <p>The reset button used to clear the content of the input</p> |
| cvi-AutoComplete-clearIcon | <p>The default reset icon used inside the reset button</p> |
| cvi-AutoComplete-loadingIndicator | <p>The loading indicator container</p> |
| cvi-AutoComplete-loadingIcon | <p>The default loading icon</p> |

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
| hitComponent | <code>Component</code> | <p>Component used for rendering each hit from the results. If it is not provided the rendering defaults to displaying the hit in its JSON form. The component will be called with a <code>record</code> prop.</p> |
| noResultsFound | <code>node</code> | <p>Change the apparence of the default empty results found.</p> |
| className | <code>string</code> | <p>Add a custom CSS class to the component</p> |
| style | <code>object</code> | <p>Add a custom React.CSSProperties object to the Hits container</p> |
| emptySearch | <code>string</code> | <p>The text shown on empty results</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-Hits | <p>The root div of the widget</p> |
| cvi-Hits-list | <p>The list of results</p> |
| cvi-Hits-item | <p>The hit list item</p> |

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
| hitComponent | <code>Component</code> |  | <p>Component used for rendering each record from the results. If it is not provided the rendering defaults to displaying the record in its JSON form. The component will be called with a <code>record</code> prop.</p> |
| showPrevious | <code>boolean</code> | <code>false</code> | <p>Define if button of <code>load previous</code> should be shown</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the component</p> |
| loadMore |  |  | <p>The label of load more button</p> |
| loadPrevious |  |  | <p>The label of load previous button</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-InfiniteHits | <p>The root div of the widget</p> |
| cvi-InfiniteHits-list | <p>The list of hits</p> |
| cvi-InfiniteHits-item | <p>The hit list item</p> |
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
| country | <code>Array.&lt;string&gt;</code> | <code>[&#x27;CA&#x27;</code> | <p>Filter the suggestion to the given country codes. (The countries values must be formatted according to the ISO 3166, e.g. &quot;CA&quot;)</p> |
| locale | <code>string</code> | <code>&quot;&#x27;en&#x27;&quot;</code> | <p>Define the language for the presented suggestions (The locale value must be formatted according to the ISO 639, e.g. 'en')</p> |
| limit | <code>number</code> | <code>5</code> | <p>Define the limit number for the presented suggestions</p> |
| renderSuggestion | <code>function</code> |  | <p>Define how suggestions will be rendered</p> |
| onSuggestionSelected | <code>function</code> |  | <p>Executes every time that a suggestion is selected</p> |
| triggerSubmitOnSuggestionSelected | <code>boolean</code> | <code>false</code> | <p>Define if the Location form container should be submitted onSuggestionSelected</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the Location form container.</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the Location form container.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <InstantSearch>. By default, the value is 200ms.</p> |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Set autoFocus to the autocomplete input</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the Location form container</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to the Location form container</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-Location | <p>the root div of the widget</p> |
| cvi-Location-form | <p>the wrapping form</p> |
| cvi-Location-input | <p>the search input</p> |
| cvi-Location-submit | <p>the submit button</p> |
| cvi-Location-submitIcon | <p>the default magnifier icon used with the search input</p> |
| cvi-Location-clear | <p>the reset button used to clear the content of the input</p> |
| cvi-Location-clearIcon | <p>the default reset icon used inside the reset button</p> |
| cvi-Location-loadingIndicator | <p>the loading indicator container</p> |
| cvi-Location-loadingIcon | <p>the default loading icon</p> |

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
| focusShortcuts | <code>Array.&lt;string&gt;</code> | <code>[&#x27;s&#x27;,&#x27;/&#x27;</code> | <p>List of keyboard shortcuts that focus the search box. Accepts key names and key codes.</p> |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Should the search box be focused on render?</p> |
| searchAsYouType | <code>boolean</code> | <code>true</code> | <p>Should we search on every change to the query? If you disable this option, new searches will only be triggered by clicking the search button or by pressing the enter key while the search box is focused.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the SearchBox form container.</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the SearchBox form container.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <InstantSearch>. By default, the value is 200ms.</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the SearchBox form container</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to SearchBox form container</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-SearchBox | <p>the root div of the widget</p> |
| cvi-SearchBox-form | <p>the wrapping form</p> |
| cvi-SearchBox-input | <p>the search input</p> |
| cvi-SearchBox-submit | <p>the submit button</p> |
| cvi-SearchBox-submitIcon | <p>the default magnifier icon used with the search input</p> |
| cvi-SearchBox-clear | <p>the reset button used to clear the content of the input</p> |
| cvi-SearchBox-clearIcon | <p>the default reset icon used inside the reset button</p> |
| cvi-SearchBox-loadingIndicator | <p>the loading indicator container</p> |
| cvi-SearchBox-loadingIcon | <p>the default loading icon</p> |

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
