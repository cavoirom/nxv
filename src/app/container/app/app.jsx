import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rest from '../../shared/rest';

import Header from '../../component/header/header';
import Content from '../../component/content/content';

function App() {
  const dispatch = useDispatch();

  // Fetch data for first load
  useEffect(() => {
    rest
      .get('api/site.json')
      .then((response) =>
        dispatch({
          type: 'LOAD_STATE',
          content: response,
        }),
      )
      .catch((error) => console.log(error));
  }, []);

  const stateDefined = useSelector((state) => state !== undefined);
  return stateDefined ? (
    <>
      <Header />
      <Content />
    </>
  ) : (
    <></>
  );
}

export default App;
