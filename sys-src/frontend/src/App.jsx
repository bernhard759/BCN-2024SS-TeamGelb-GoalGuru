import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GameSelect from './components/GameSelect';

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => { console.log(data); return res.json()})
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
      <GameSelect></GameSelect>
      <p>{!data ? "Loading..." : data}</p>

    </>
  )
}

export default App
