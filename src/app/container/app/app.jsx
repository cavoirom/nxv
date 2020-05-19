import { h, Fragment } from 'preact';
import Header from '../header/header';
import Content from '../content/content';
import Footer from '../footer/footer';

export default function App() {
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}
