# rct-isomorphic-state

global state for react with no context

# installation.

```sh
yarn add rct-isomorphic-state
npm i rct-isomorphic-state
```

## this library uses immutable i.e (all states you pass we transform it to immutable refs unless you passed immutable ref)

**NOTE: by default when you request store data we pass javascript values unless you pass `useImmutableResults` prop**

## isomorphicState Props

|        Name         |            Type            | Required |
| :-----------------: | :------------------------: | :------: |
|       stateId       | string or Array of strings |   true   |
|    initialState     |    any / immutable ref     |  false   |
|       useSsr        |          boolean           |  false   |
| useImmutableResults |           string           |   true   |

## stateId Prop

if you passed array of strings we consider that as deep structure path

```sh
   const myStore = isomorphicState({
     stateId: ["prop1", "props2"],
     initialState: "initialValue"
    })

    your store state ends up to this structure
    {
      prop1:{
        props2: "initialValue"
      }
    }
```

## initialState Prop

if you pass undefined value we defaults it to immutable Map

```sh
   const myStore = isomorphicState({
     stateId: ["prop1", "props2"],
    })

```

## useImmutableResults Prop

if you passed string of true value

```sh
   const myStore = isomorphicState({
     stateId: ["prop1", "props2"],
     initialState: {  name: "some name" },
     useImmutableResults: "true"
    })

  you can use the state as immutable ref

```

## useValuePathSubscription Props

|     Name     |            Type            | Required |
| :----------: | :------------------------: | :------: |
|     path     | string or Array of strings |   true   |
| initialState |    any / immutable ref     |  false   |

## 🔨 Usage

## in App.js file

```jsx
import Form from "./Form";
import DataPreviewer from "./DataPreviewer";

const App = () => {
  return (
    <>
      <Form />
      <DataPreviewer />
    </>
  );
};

export default App;
```

## in myFormState.js file

```jsx
import isomorphicState from "rct-isomorphic-state/dist";
const initialState = {
  name: "",
  age: 0,
};

const formState = isomorphicState({
  stateId: "myFormSpecificId",
  initialState,
  useImmutableResults: "false",
});

export default formState;
```

## in Form.js file

```jsx
import React from "react";
import formState from "./myFormState";

const Form = () => {
  const [state, setState] = formState.useConsumerState();

  const onChange = React.useCallback(
    ({ target: { value, name } }) => {
      setState({ path: name, newStateValue: value });
    },
    [setState]
  );

  return (
    <div>
      <input
        style={styles.input}
        value={state.name}
        onChange={onChange}
        autoComplete="off"
        name="name"
        type="text"
      />

      <br />

      <input
        style={styles.input}
        value={state.age}
        onChange={onChange}
        name="age"
        type="number"
      />
    </div>
  );
};

export default Form;
```

## in DataPreviewer.js file

```jsx
import React from "react";
import formState from "./myFormState";

const DataPreviewer = () => {
  const values = formState.useConsumerState()[0];

  return <div>{JSON.stringify(values)}</div>;
};

export default DataPreviewer;
```

## if you noticed we use `useConsumerState` in `DataPreviewer file` to listen to whole state this wil make your component renders on every change for next state update

`so what if we need it only reconcile and render for specific prop or deep path update` we could use `useValuePathSubscription`

## in DataPreviewer.js file

```jsx
import React from "react";
import formState from "./myFormState";

const DataPreviewer = () => {
  const values = formState.useValuePathSubscription("name");

  return <div>{JSON.stringify(values)}</div>;
};

export default DataPreviewer;
```

## easy to use.

## uses Immutable for sake of memory.

## no Context to save components for

unnecessary reconciliations (diffing + rerender) .
