import * as React from 'react';
import * as ReactRedux from 'react-redux';
import rest from '../../shared/rest';

import Header from '../../component/header/header';
import Content from '../../component/content/content';

const { useEffect } = React;
const { useDispatch, useSelector } = ReactRedux;

function App() {
  const dispatch = useDispatch();

  // Fetch data for first load
  useEffect(() => {
    rest.get('db/db.json')
        .then(response => dispatch({
          type: 'LOAD_STATE',
          content: response
        }))
        .catch(error => console.log(error));
  }, []);

  const stateDefined = useSelector(state => state !== undefined);
  return stateDefined ? <><Header/><Content/></> : <></>;
}

export default App;