import { useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import ModelTable from './components/ModelTable'
import LanguageTable from './components/LanguageTable'
import DatasetTable from './components/DatasetTable'
import WorldMap from './components/WorldMap'
import AutoComplete from './components/AutoComplete'
import LanguagePlot from './components/LanguagePlot'
import { Carousel } from 'primereact/carousel'

function App () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLanguages, setSelectedLanguages] = useState([])
  useEffect(() => {
    fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify({ selectedLanguages })
    })
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
  }, [selectedLanguages])

  return (
    <PrimeReactProvider>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5vh 0'
          }}
        >
          <div>
            <span
              role='img'
              aria-label='Globe Emoji'
              style={{ fontSize: '70px' }}
            >
              🌍
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            Global AI Monitor
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#555', marginTop: '0' }}>
            Tracking language proficiency of AI models for every language
          </p>
          <AutoComplete
            languages={data?.language_table}
            onComplete={items => setSelectedLanguages(items)}
          />
        </header>
        <main
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            paddingBottom: '5vh'
          }}
        >
          {loading && (
            <i className='pi pi-spinner pi-spin' style={{ fontSize: '4rem' }} />
          )}
          {error && <p>Error: {error}</p>}
          {data && (
            <>
              <div
                style={{
                  flex: '60vw 100vw 40vw',
                  maxWidth: 'min(100vw, 800px)'
                }}
              >
                <ModelTable data={data.model_table} />
              </div>
              <div
                style={{
                  flex: '60vw 100vw 40vw',
                  maxWidth: 'min(100vw, 800px)'
                }}
              >
                <LanguageTable
                  data={data.language_table}
                  selectedLanguages={selectedLanguages}
                  setSelectedLanguages={setSelectedLanguages}
                />
              </div>
              <div
                style={{
                  flex: '60vw 100vw 40vw',
                  maxWidth: 'min(100vw, 800px)'
                }}
              >
                <DatasetTable data={data} />
              </div>
              <div
                id='figure'
                style={{
                  flex: '100vw 100vw 100vw',
                  maxWidth: 'min(100vw, 800px)',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Carousel
                  value={[
                    <WorldMap data={data} />,
                    <LanguagePlot data={data} />
                  ]}
                  numScroll={1}
                  numVisible={1}
                  itemTemplate={item => item}
                  circular
                  style={{ width: '800px', minHeight: '650px' }}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </PrimeReactProvider>
  )
}

export default App
