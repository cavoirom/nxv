import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSection from '../../component/event-section/event-section';
import { createFetchAction, FETCH_HOME } from '../../store/action';

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createFetchAction(FETCH_HOME));
  }, []);

  const { me, journey, work } = useSelector((state) => state.home);
  return (
    <>
      <div className="pure-g">
        <div className="pure-u-1">
          <h3>{me.title}</h3>
          <p>{me.content}</p>
        </div>
      </div>
      <div className="pure-g">
        <div className="pure-u-1">
          <h3>{journey.title}</h3>
        </div>
        {journey.years.map((year) => (
          <EventSection key={year.year} year={year} />
        ))}
      </div>
      <div className="pure-g">
        <div className="pure-u-1">
          <h3>{work.title}</h3>
        </div>
        {work.years.map((year) => (
          <EventSection key={year.year} year={year} />
        ))}
      </div>
    </>
  );
}
