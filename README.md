# rct-isomorphic-state

global state for react with no context

# installation.

```sh
yarn add rct-isomorphic-state
npm i rct-isomorphic-state
```

- easy to use
- it uses Immutable for sake of memory
- no Context to prevent components from unnecessary reconciliations (diffing + rerender)

## this library uses immutable i.e (all states you pass we transform it to immutable refs unless you passed immutable ref)

**NOTE: by default when you request store data we pass javascript values unless you set `useImmutableResults to "true"` **

# useIsoState Hook
|        Name         |          Type           | Required |
| :-----------------: | :---------------------: | :------: |
|      fullPath       | string or Array<string> |   true   |
| useImmutableResults |         string          |   true   |
|    initialState     |   any / immutable ref   |  false   |

<details>
  <summary>Click to see Details</summary>

- `fullPath` if you passed array of strings we consider that as deep structure path

- `useImmutableResults` if "true" you could expect the state result as immutable ref else it's js data

- `initialState` could be any js data or immutable ref and if you passed undefined value we defaults it to immutable Map

## Example

```jsx
import React from "react";
import { useIsoState } from "rct-isomorphic-state/dist";

const initialState = {
  name: "name",
  age: 12,
};

export default () => {
  const [state, setState] = useIsoState(
    "stateId",
    "false", // "true" will make the returned state as immutable Map ref
    initialState
  );

  const onChange = React.useCallback(
    ({ target: { value, name } }) => {
      setState({ path: name, newStateValue: value });
    },
    [setState]
  );

  return (
    <div>
      <input
        // if useImmutableResults was "true" your could use  value like  `value={state.get("name")}`
        value={state.name}
        onChange={onChange}
        autoComplete="off"
        name="name"
        type="text"
      />

      <br />

      <input
        // if useImmutableResults was "true" your could use  value like  `value={state.get("age")}`
        value={state.age}
        onChange={onChange}
        name="age"
        type="number"
      />
    </div>
  );
};
```

</details>

# useValuePathSubscription Hook

**NOTE: we recommend use this hook for specific deep path update **

<details>
  <summary>Click to see Details</summary>

## Params

```sh
  |        Name         |          Type           | Required |
  | :-----------------: | :---------------------: | :------: |
  |      fullPath       | string or Array<string> |   true   |
  | useImmutableResults |         string          |   true   |
  |    initialState     |   any / immutable ref   |  false   |
```

- `fullPath` a path to the state or deep field in state , if you passed array of strings we consider that as deep structure path

- `useImmutableResults` if "true" you could expect the state result as immutable ref else it's js data

- `initialState` could be any js data or immutable ref and if you passed undefined value we defaults it to immutable Map

## Examples

### Deep value example

```jsx
import React from "react";
import { useValuePathSubscription } from "rct-isomorphic-state/dist";

export default () => {
  const nameValue = useValuePathSubscription(["stateId", "name"], "false", "");

  return <div>{nameValue}</div>;
};
```

### State example

```jsx
import React from "react";
import { useValuePathSubscription } from "rct-isomorphic-state/dist";

export default () => {
  const stateValues = useValuePathSubscription(
    "stateId",
    "false", // "true" will make the returned state as immutable Map ref
    {}
  );

  // if useImmutableResults was "true" your could use  nameValue like  `value={state.get("name")}` return <div>{stateValues}</div>;
  return (
    <>
      {/* if useImmutableResults was "true" > <div>{stateValues.get("name")}</div> */}
      <div>{stateValues.name}</div>
      {/* if useImmutableResults was "true" > <div>{stateValues.get("age")}</div> */}
      <div>{stateValues.age}</div>
    </>
  );
};
```

</details>

# useIsoSelector

  <details>
  <summary>Click to see Details</summary>

## Params

```sh
  |        Name         |          Type           | Required |
  | :-----------------: | :---------------------: | :------: |
  |     fnSelector      | Function(store)         |   true   |
  | useImmutableResults |         string          |   true   |
```

- `fnSelector` a function that take the whole store and return what ever values you need

- `useImmutableResults` if "true" you could expect the state and store that passed to fnSelector result as immutable ref else it's js data

**NOTE: we memoize the values that you returned from fnSelector so next time if they didn't change there is not render to your components those use that selector **

## Example

```jsx
import React from "react";
import { useIsoSelector } from "rct-isomorphic-state/dist";

export default () => {
  const selectorData = useIsoSelector(store => store.stateId, "false");

  ## with Ts
  - interface DataFromSelector {
    name: string;
    age: number
  }

  const selectorData = useIsoSelector<DataFromSelector, "false">(store => store.stateId, "false");

  return <div>JSON.stringify(selectorData)</div>;
};
```

</details>

# useIsoSetState

  <details>
  <summary>Click to see Details</summary>

## Params

```sh
  |        Name         |          Type           | Required |
  | :-----------------: | :---------------------: | :------: |
  |     statId          | string or Array<string> |   true   |
  |     callback        |      Function           |   false  |
```

- `statId` if you passed array of strings we consider that as deep structure path,

- `callback` if provided it will be executed after state update

**NOTE: it return a function that takes specific deep field/fields path and newValue **

## Example

```jsx
import React from "react";
import { useIsoSetState } from "rct-isomorphic-state/dist";

export default () => {
  const setState = useIsoSetState("appTheme");

  const onChange = React.useCallback(() => setState("primary", "activeTheme"), [
    setState,
  ]);

  return <Switch onChange={onChange} children="switch app theme" />;
};
```

</details>

# getCacheData

  <details>
  <summary>Click to see Details</summary>

## a function that takes `useImmutableResults Prop`

**NOTE: if your used `getCacheData` it won't re-updated if any fields did **

## Example

```jsx
import React from "react";
import { getCacheData } from "rct-isomorphic-state/dist";

export default () => {
  const store = getCacheData("false");
  return <div children={JSON.stringify(store)} />;
};
```

</details>

# addCacheListener and removeCacheListener

  <details>
  <summary>Click to see Details</summary>

## a function that takes new listener

- `newListener` should be like this structure,

```sh
  {
    subscriber: () => void | (updatedValues) => void;
    path: string | string[]
  }
```

## Example

```jsx
import React from "react";
import {
  addCacheListener,
  removeCacheListener,
} from "rct-isomorphic-state/dist";

export default () => {
  React.useEffect(() => {
    addCacheListener({
      path: ["stateId", "name"],
      subscriber: (newNameValue) => console.log(newNameValue), // maybe api(newNameValue)
    });

    return () => removeCacheListener(["stateId", "name"]);
  }, []);

  return <div />;
};
```

</details>

# updateCache

  <details>
  <summary>Click to see Details</summary>

## Params

```sh
  |        Name                     |          Type           | Required |
  | :-----------------------------: | :---------------------: | :------: |
  |      fullPath                   | string or Array<string> |   true   |
  |     newValues                   |       string            |   true   |
  |    runSubscribers               |       function          |  false   |
  |    notifyListenersWithThatPath  |       boolean           |  false   |
```

- `fullPath` if you passed array of strings we consider that as deep structure path

- `newValues` new value for update

- `notifyListenersWithThatPath` if true we notify other listeners those listen for `fullPath prop`

- `runSubscribers` if you want to notify another listeners

## Example

```jsx
import React from "react";
import { updateCache } from "rct-isomorphic-state/dist";

const onChange = (e) => {
  updateCache(
    ["stateId", "age"],
    e.target.value,

    // run your listeners
    //  () => null,

    // notifyListenersWithThatPath: don't notify Listeners listen for  ["stateId", "age"]
    false
  );
};

export default () => {
  return <Input onChange={onChange} />;
};
```
