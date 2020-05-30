// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useAction, useSelector } from '@preact-hooks/unistore';
import EventSection from '../../component/event-section/event-section';
import { fetchHomeAction } from '../../store/action';

export default function Home() {
  const home = useSelector((state) => state.home);

  const fetchHome = useAction(fetchHomeAction);
  useEffect(() => {
    if (!home) {
      fetchHome();
    }
  }, []);

  if (!home) {
    return <></>;
  }

  const { me, journey, work } = home;
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
