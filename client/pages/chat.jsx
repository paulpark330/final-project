import React, { useEffect, useContext } from 'react';
import AppContext from '../lib/app-context';

export default function Chat() {
  const { setRoute } = useContext(AppContext);
  useEffect(() => {
    setRoute('Chat');
  }, []);
  return <div></div>;
}
