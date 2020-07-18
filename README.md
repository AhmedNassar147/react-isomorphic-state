# rct-isomorphic-state
global state for react with no context


# installation.
```sh
yarn add rct-isomorphic-state
npm i rct-isomorphic-state
```


## isomorphicState Props

| Name         |         Type                 | Required |
| :----------: | :--------------------------: | :------: |
| stateId      |   string or Array of strings |   true   |
| initialState |   any / immutable refs       |   false  |


## useValuePathSubscribtion Props

| Name       |         Type                 | Required |
| :--------: | :--------------------------: | :------: |
| path       |   string or Array of strings |   true   |



## your could create deep structure by use this way
  ```sh
    import isomorphicState from 'rct-isomorphic-state/dist'
    const state = isomorphicState(["forms", "form1"], initialState);
  ```

## inner state and functionality is immutable way

## 🔨 Usage

## in myFormState.js file
```jsx
  import isomorphicState from 'rct-isomorphic-state/dist'
 
  const initialState = {
    name: "",
    age: 0,
  };

  export default isomorphicState("form1", initialState);
```


## in App.js file
```jsx
  import Form from './Form'
  import DataPreviewer from './DataPreviewer';

  const App = () => {
    return (
      <>
        <Form />
        <DataPreviewer />
      </>
    )
  }

  export default App
```

## in Form.js file
```jsx
  import React from 'react'
  import myformState from './myFormState'
 
 const Form = () => {
  const [state, setState] = formState.useConsumerState()
  

  const onChange = React.useCallback(({ target:{ value, name } }) => {
    setState({ path: name, newStateValue: value });
  } ,[setState]);


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

      <br/>

      <input 
        style={styles.input}
        value={state.age}
        onChange={onChange}
        name="age"
        type="text"
      />
    </div>
  )
};

export default Form;
```

## in DataPreviewer.js file
```jsx
  import React from 'react';
  import formState from './myFormState';

  const DataPreviewer = () => {
    const values = formState.useConsumerState()[0];

    return (
      <div style={{ width: "48%" }}>
        {JSON.stringify(values)} 
      </div>
    )
  };

  export default DataPreviewer
```



## if you noticed  we use `useConsumerState` in `DataPreviewer file` to listen to whole state this wil make  your component renders on every change for next state update
  `so what if we need it only reconcile and render for specific prop or deep path update`  we could use `useValuePathSubscribtion` 


## in DataPreviewer.js file
```jsx
  import React from 'react';
  import formState from './myFormState';

  const DataPreviewer = () => {
    const values = formState.useValuePathSubscribtion("name");

    return (
      <div style={{ width: "48%" }}>
        {JSON.stringify(values)} 
      </div>
    )
  };

  export default DataPreviewer
```


# why i don't like context or any lib using it.

# we have two cases 
```
  1- we have one context wraps your entire app
  <!-- so when a context gets updated it will rerender all components that use that context -->

  2- if your app app gets larger you will probably use multi contexts wrapping each other    
```