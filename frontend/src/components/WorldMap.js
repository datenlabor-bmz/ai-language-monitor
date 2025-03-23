import { useRef, useEffect, useState } from 'react'
import * as topojson from 'topojson-client'
import * as Plot from '@observablehq/plot'

function smoothProgressBar(fraction, { color = false } = {}) {
  const blocks = ['▏','▎','▍','▌','▋','▊','▉','█'];
  const width = 10;
  const totalUnits = width * 8;
  const filledUnits = Math.round(fraction * totalUnits);
  const fullBlocks = Math.floor(filledUnits / 8);
  const remainder = filledUnits % 8;
  return '█'.repeat(fullBlocks) + (remainder > 0 ? blocks[remainder - 1] : '')
}

const WorldMap = ({ data }) => {
  const containerRef = useRef()
  const [mapData, setMapData] = useState()

  useEffect(() => {
    fetch('/world.geo.json')
      .then(res => res.json())
      .then(setMapData)
  }, [])

  useEffect(() => {
    if (mapData === undefined) return
    const countries = mapData
    // const countries = topojson.feature(mapData, mapData.objects["world.geo"])
    console.log(countries)
    const codes = countries.features.map(d => d.properties?.ISO_A2_EH)
    console.log(codes.toSorted().join(', '))
    const plot = Plot.plot({
      width: 750,
      height: 400,
      projection: 'equal-earth',
      marks: [
        Plot.geo(countries, {
          fill: d => {
            const score = data.countries[d.properties?.ISO_A2_EH]?.score
            return score
          },
          title: d => {
            const languages = data.countries[d.properties?.ISO_A2_EH]?.languages.toSorted((a, b) => b.population - a.population)
            const pop = languages?.map(a => a.population).reduce((prev, a) => prev + a, 0)
            const langstring = languages?.slice(0, 10).map(a=> `${smoothProgressBar(a.population / pop)} ${a.name}`).join('\n\n') + (languages?.length > 10 ? `\n\n...` : '')
            return `${d.properties.ADMIN}\n\n${langstring}`
          },
          tip: true
        })
      ],
      color: {
        scheme: 'Blues',
        unknown: 'gray',
        label: 'Score',
        legend: true,
        domain: [0, 0.5]
      }
    })
    containerRef.current.append(plot)
    return () => plot.remove()
  }, [mapData])

  return <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
}

export default WorldMap
