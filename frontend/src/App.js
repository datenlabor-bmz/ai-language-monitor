import './App.css'
import { useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import ModelTable from './components/ModelTable'
import LanguageTable from './components/LanguageTable'
import DatasetTable from './components/DatasetTable'
function App () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/results.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(jsonData => {
        setData(jsonData)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='emoji-container'>
          <span
            role='img'
            aria-label='Hugging Face Emoji'
            className='header-emoji'
          >
            🌍
          </span>
        </div>
        <h1>Global AI Language Monitor</h1>
        <p>Tracking language proficiency of AI models for every language</p>

        <div className='data-container' style={{ width: '100%' }}>
          <PrimeReactProvider>
            {loading && <p>...</p>}
            {error && <p>Error: {error}</p>}
            {data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                  <ModelTable data={data} />
                  <LanguageTable data={data} />
                </div>
                <DatasetTable data={data} />
              </div>
            )}
          </PrimeReactProvider>
        </div>
      </header>
    </div>
  )
}

export default App
