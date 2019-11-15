# Features

- Facilitates the interactions between custom React components and Clinia's client.
- Gives acces to properties and functions as React hooks

## Quickstart

Let's use the `connectHits` connector to access and display search results obtained from a search query triggered from another unknown component. The properties made available through the use of the connectors will be refered to as **Connected Props**.

```js
class Hits extends React.Component {
  render() {
    const { records } = this.props
    return records.map(record => (
      <div>
        {record.item.id}
      </div>
    ))      
  }
}
export default connectHits(Hits)
```

It is also possible to specify some properties while using the exported component to affect the behavior of the connector. Those will be refered to a **Exposed Props**.

```js
<Container>
  <Hits perPage={20} />
</Container>
```

# API
## `1. connectSearchBox`
This connector provides the logic to build a component that will let the user search for a query. 

## 1.1 Initialization
### `connectSearchBox(component)`
Connects a component with the SearchBox context.

#### Arguments
- **component (_React.Component_)** -- The component to connect

#### Returns
A component wrapped inside the SearchBox context
<br/><br/>

---
## 1.2 Connected Props
Once connected, the component will have access to the following properties and functions:
<br/><br/>

### `indexContextValue`
The name of the targeted index, if a single index is targeted. 

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `currentRefinement`
The current query used for searches.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `isSearchStalled`
A flag that indicates if Vision has detected that searches are stalled.

| Type | Default |
|------|---------|
| _boolean_ | `false` |
<br/>

---
### `refine(query)`
Sets the current query and triggers a search.

#### Arguments
- **query (_string_)** -- The query

<br/>

---
## 1.3 Exposed Props
The following properties will be used by the connector if they are specified on the wrapped component.
<br/><br/>

### `defaultRefinement`
Provide a default value for the query.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `queryType`
Type of matching strategy for the query. There a re two strategies supported at the moment : 
<br/>
`prefix_none` => Will match full words.<br/>
`prefix_last` => Will match partial words.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

## `2. connectHits`
This connector provides the logic to build a component that will let the user consult the search results.

## 2.1 Initialization
### `connectHits(component)`
Connects a component with the Hits context.

#### Arguments
- **component (_React.Component_)** -- The component to connect

#### Returns
A component wrapped inside the Hits context
<br/><br/>

---
## 2.2 Connected Props
Once connected, the component will have access to the following properties and functions:
<br/><br/>

### `indexContextValue`
The name of the targeted index, if a single index is targeted. 

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `records`
The search results.

| Type | Default |
|------|---------|
| _Record[]_ | `undefined` |
<br/>

## `3. connectInfiniteHits`
This connector provides the logic to build a component that will let the user consult the search results with infinite scrolling enabled.

## 3.1 Initialization
### `connectInfiniteHits(component)`
Connects a component with the InfiniteHits context.

#### Arguments
- **component (_React.Component_)** -- The component to connect

#### Returns
A component wrapped inside the InfiniteHits context
<br/><br/>

---
## 3.2 Connected Props
Once connected, the component will have access to the following properties and functions:
<br/><br/>

### `indexContextValue`
The name of the targeted index, if a single index is targeted. 

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `records`
The search results.

| Type | Default |
|------|---------|
| _Record[]_ | `undefined` |
<br/>

---
### `hasMore`
Flag that indicates if their are mote search results to be loaded in relation to the current page, the number of results per page and the total number of results.

| Type | Default |
|------|---------|
| _boolean_ | `false` |
<br/>

---
### `refineNext()`
Loads the next page of search results.

<br/>

## `4. connectAutocomplete`
This connector provides the logic to build a component that will let the user search for a query and autocomplete its query with query suggestions. This connector enables the same capabilities as the `connectSearchBox` connector, in addition to the autocomplete functionnalities.

## 4.1 Initialization
### `connectAutocomplete(component)`
Connects a component with the Autocomplete context.

#### Arguments
- **component (_React.Component_)** -- The component to connect

#### Returns
A component wrapped inside the Autocomplete context
<br/><br/>

---
## 4.2 Connected Props
Once connected, the component will have access to the following properties and functions:
<br/><br/>

### `indexContextValue`
The name of the targeted index, if a single index is targeted. 

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `currentRefinement`
The current query used for searches.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `isSearchStalled`
A flag that indicates if Vision has detected that searches are stalled.

| Type | Default |
|------|---------|
| _boolean_ | `false` |
<br/>

---
### `suggestions`
The suggestions for the given suggestion query.

| Type | Default |
|------|---------|
| _QuerySuggestion[]_ | `[]` |
<br/>

---
### `refine(query)`
Sets the current query and triggers a search.

#### Arguments
- **query (_string_)** -- The query.

<br/>

---
### `searchForSuggestions(query)`
Sets the current suggestions query and triggers a suggestions search.

#### Arguments
- **query (_string_)** -- The suggestion query.

<br/>

---
## 4.3 Exposed Props
The following properties will be used by the connector if they are specified on the wrapped component.
<br/><br/>

### `defaultRefinement`
Provide a default value for the query.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `queryType`
Type of matching strategy for the query. There a re two strategies supported at the moment : 
<br/>
`prefix_none` => Will match full words.<br/>
`prefix_last` => Will match partial words.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

---
### `size`
Maximum number of suggestions to return.

| Type | Default |
|------|---------|
| _number_ | `5` |
<br/>

---
### `highlighPreTag`
The pre tag that will highlight the matched part of the query in each suggestion. Usually a html tag like `<strong>`.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

### `highlighPostTag`
The post tag that will highlight the matched part of the query in each suggestion. Usually a html tag like `</strong>`.

| Type | Default |
|------|---------|
| _string_ | `undefined` |
<br/>

# Shared Models

## `QuerySuggestion`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `suggestion` | _string_ | Suggested query ||
| `facet` | _string_ | Type of the suggestion ||
| `highlight` | _string_ | Augmented suggestion ||
<br/>

### `Record (health_facility)`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `documentType` | _string_ | Type of document. | `health_facility`|
| `id` | _string_ | Identifier of the resource. ||
| `type` | _string_ | Type of resource. ||
| `address` | _Address_ | Address. ||
| `geoPoint` | _GeoPoint_ | Coordinate of the resource, if applicable. ||
| `onlineBookingUrl` | _string_ | Online booking url. ||
| `distance` | _double_ | Distance (in meters) from the center of the location search parameter. ||
| `openingHours` | _Map<string, Interval[]>_ | Opening hours. | The keys are strings from `1` to `7`.<br/>`1: Monday`<br/>`2: Tuesday`<br/>`3: Wednesday`<br/>`4: Thursday`<br/>`5: Friday`<br/>`6: Saturday`<br/>`7: Sunday` |
| `name` | _string_ | Name of the resource. ||
| `phones` | _Phone[]_ | Name of the resource. ||
| `owner` | _string_ | Owner of the resource (mainly used internally) ||
<br/>

---
### `Record (professional)`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `documentType` | _string_ | Type of document. | `professional` |
| `id` | _string_ | Identifier of the resource. ||
| `title` | _string_ | Title of the resource | `MR`<br/>`MS`<br/>`DR`<br/>`DRE`<br/>|
| `practiceNumber` | _string_ | Practice number of the resource. ||
| `name` | _string_ | Name. ||
| `phones` | _Phone[]_ | Phones. ||
| `owner` | _string_ | Owner of the resource (mainly used internally) ||
<br/>

---
### `Phone`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `countryCode` | _string_ | Country code. ||
| `number` | _string_ | Phone number. ||
| `extension` | _string_ | Extension. ||
| `type` | _string_ | Type of phone. | `UNKNOWN`<br/>`MAIN`<br/>`ALTERNATE`<br/>`RECEPTION`<br/>`FAX`<br/>`TEXT_TELEPHONE_TTY`<br/>`INFO`<br/>`TOOL_FREE`<br/>`PAGER`<br/>`MOBILE`<br/>`HOME`<br/>`WORK`<br/>`PERSONAL`<br/>`OTHER`<br/> |
<br/>

---
### `Address`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `streetAddress` | _string_ | Street number plus route name. ||
| `suiteNumber` | _string_ | Suite, door, appartment number. ||
| `postalCode` | _string_ | Postal code. ||
| `neighborhood` | _string_ | Neighborhood. ||
| `locality` | _string_ | Locality. ||
| `place` | _string_ | City. ||
| `region` | _string_ | Name of the region. ||
| `regionCode` | _string_ | ISO 3166-2 region code. ||
| `country` | _string_ | Name of the country. ||
| `countryCode` | _string_ | ISO 3166 country code ||
<br/>

---
### `Interval`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `start` | _string_ | Start time of the time interval. | Format is `HH:mm` |
| `end` | _string_ | End time of the time interval. | Format is `HH:mm` |
<br/>

---
### `Geometry`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `bounds` | _Bounds_ | Bounds of the location. ||
| `location` | _GeoPoint_ | Best coordinate to locate the location. ||
<br/>

---
### `Bounds`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `northEast` | _GeoPoint_ | North-east coordinate delimiting the bounds of the location. ||
| `southWest` | _GeoPoint_ | South-west coordinate delimiting the bounds of the location. ||
<br/>

---
### `GeoPoint`
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `lat` | _double_ | Latitude ||
| `lng` | _double_ | Longitude ||
<br/>

---
### `LocationTranslation` 
| Field name | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| `formattedAddress` | _string_ | Formatted address, ready to display. ||
| `route` | _string_ | Street name of the location. ||
| `neighborhood` | _string_ | Neighborhood. ||
| `locality` | _string_ | Locality. ||
| `place` | _string_ | Locality. ||
| `district` | _string_ | District. ||
| `region` | _string_ | Name of the region. ||
| `country` | _string_ | Name of the country. ||
<br/>
