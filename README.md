ember-cli-loadify
==============================================================================

Lightweight loading library for paginated records. Ember Loadify makes it easy to load what you need, when you need it. No longer waiting on model hashes for pages with multiple models being displayed. Loadify your application by only loading moddels as they come into view!


Installation
------------------------------------------------------------------------------

```
ember install ember-cli-loadify
```


Usage
------------------------------------------------------------------------------

#### records

We want to display a list of records to the user when they reach our component. The records are not loaded until the component is visible.

```
{{#ember-loadify modelName="user" as |loadify|}}
  {{#each loadify.records as |user|}}
    <div>{{user.name}}</div>
  {{/each}}
{{/ember-loadify}}
```

#### isLoading

True when querying the store.

```
{{#ember-loadify modelName="user" as |loadify|}}
  ...
  {{#if loadify.isLoading}}
    Retrieving Your Data, m'Lord
  {{/if}}
{{/ember-loadify}}
```

#### isResetting

True when reloading to the beginning of the list.

```
{{#ember-loadify modelName="user" as |loadify|}}
  ...
  {{#if loadify.isResetting}}
    Returning to page 1, m'Lord.
  {{/if}}
{{/ember-loadify}}
```

#### isEmpty

When there are no records to display.

```
{{#ember-loadify modelName="user" as |loadify|}}
  ...
  {{#if loadify.isEmpty}}
    We've Returned Empty Handed...
  {{/if}}
{{/ember-loadify}}
```

#### isLastPage

When the loadify has loaded the last page.

```
{{#ember-loadify modelName="user" as |loadify|}}
  ...
  {{#if loadify.isLastPage}}
    Well, that's all folks!
  {{/if}}
{{/ember-loadify}}
```

#### canLoadMore

When there are still more pages to load

```
{{#ember-loadify modelName="user" as |loadify|}}
  ...
  {{#if loadify.canLoadMore}}
    But wait... there's more!
  {{/if}}
{{/ember-loadify}}
```

### Actions

#### nextPage

Use when you want custom pagination.

```
{{#ember-loadify modelName="user" showPagination=false as |loadify|}}
  ...
  <button {{action loadify.nextPage}}>Load Next Page</button>
{{/ember-loadify}}
```

#### reset

Use when you want custom reset to page 1.

```
{{#ember-loadify modelName="user" as |loadify|}}
  ...
  <button {{action loadify.reset}}>Take Me Back</button>
{{/ember-loadify}}
```

### Parameters

#### params

Filter your paginated requests with user input. As your params change, the ember-loadify component will start from page 1 with the new params.

```
  # some controller
  ...
  userParams: computed('query', 'sort', function() {
    return {
      query: this.get('query'),
      sort: this.get('sort')
    }
  })
  ...
```

```
{{#ember-loadify modelName="user" params=userParams as |loadify|}}
  ...
{{/ember-loadify}}
```

#### infinite

Load next page when next page button comes into view.

Defaults to `false`

#### page

Start from a numbered page.

Defaults to `1`

#### perPage

Return perPage results each request.

Defaults to `10`

#### records

Defaults to `Ember.A([])`

#### showPagination

Show or hide the next page button.

Defaults to `true`

#### nextPageText

Text inside of the next page button.

Defaults to `Load More`

#### onRecordLoaded

Callback for when records are loaded. Returns all records in view.

```
  # some controller
  ...
  actions: {
    recordsLoaded(records) {
      alert(`${records.length} record(s) in list`);
    }
  }
  ...
```

```
{{#ember-loadify modelName="user" onRecordLoaded=(action "recordsLoaded") as |loadify|}}
  ...
{{/ember-loadify}}
```


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
