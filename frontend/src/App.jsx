import { useState, useEffect } from 'react';
import Calculator from './Calculator.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FullPageLoader from './FullPageLoader.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay (or wait for real data/components to load)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2-second delay; adjust as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className='page-wrapper'>
      <Header />
      <Calculator />
      <Footer />
    </div>
  );
}
