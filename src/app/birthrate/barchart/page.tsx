'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ceilWithBiggestDigit } from '@/utils/math'

const BirthRateBarChart = () => {
  const containerRef = useRef<SVGSVGElement>(null!)
  const tooltipRef = useRef<HTMLDivElement>(null!)

  const STYLE = {
    size: {
      width: 1000,
      height: 400
    },
    margin: {
      top: 30,
      right: 20,
      bottom: 20,
      left: 50
    }
  } as const

  const getBirthRateData = async () => {
    const data = await d3.json('/singapore_birthrate.json')
    if (!data) return

    drawChart(data as BirthRateDTO)
  }

  const drawChart = (data: BirthRateDTO) => {
    const container = d3.select(containerRef.current)
    container.selectAll('*').remove()

    const xAxisScale = d3.scaleUtc()
      .domain(d3.extent(data, d => new Date(d.Key)) as [Date, Date])
      .range([STYLE.margin.left, STYLE.size.width - STYLE.margin.right])

    container.append('g')
      .call(d3.axisBottom(xAxisScale))
      .attr('transform', `translate(0, ${STYLE.size.height - STYLE.margin.bottom})`)
      .attr('color', 'black')

    const maxBirthRate = Math.max(...data.map(data => parseInt(data.Value)))

    const yAxisSCale = d3.scaleLinear()
      .domain([0, ceilWithBiggestDigit(maxBirthRate)])
      .range([STYLE.size.height - STYLE.margin.bottom, STYLE.margin.top])

    container.append('g')
      .call(d3.axisLeft(yAxisSCale))
      .attr('transform', `translate(${STYLE.margin.left}, 0)`)
      .attr('color', 'black')
      .call(g => g.append('text')
        .attr('x', -STYLE.margin.left + 10)
        .attr('y', STYLE.margin.top / 2)
        .attr('text-anchor', 'start')
        .attr('fill', 'black')
        .text('Number of Births'))

    const bars = container.selectAll(null)
      .data(data)
      .join('rect')
      .attr('width', (STYLE.size.width - STYLE.margin.left - STYLE.margin.right) / data.length)
      .attr('height', d => STYLE.size.height - STYLE.margin.top - yAxisSCale(parseInt(d.Value)))
      .attr('x', d => xAxisScale(new Date(d.Key)))
      .attr('y', d => yAxisSCale(parseInt(d.Value)))
      .attr('fill', 'gray')

    bars.on('mouseenter', function (_, d) {
      tooltipRef.current.innerText = `${d.Key}: ${d.Value}`
      tooltipRef.current.style.display = 'block'

      bars.attr('fill', 'lightgray')
      d3.select(this).attr('fill', 'gray')
    })
      .on('mousemove', function (event: MouseEvent) {
        const {
          clientX,
          clientY
        } = event

        const TOOLTIP_OFFSET = 5

        tooltipRef.current.style.left = `${clientX + TOOLTIP_OFFSET}px`
        tooltipRef.current.style.top = `${clientY - TOOLTIP_OFFSET}px`
      })
      .on('mouseleave', function (_, d) {
        bars.attr('fill', 'lightgray')
        tooltipRef.current.style.display = 'none'
      })
  }

  useEffect(() => {
    getBirthRateData()
  }, [])

  return (
    <div>
        <svg
            ref={containerRef}
            width={STYLE.size.width}
            height={STYLE.size.height}
            viewBox={`0 0 ${STYLE.size.width} ${STYLE.size.height}`}
            style={{
              border: '1.5px solid rgba(0, 0, 0, 0.5)',
              backgroundColor: 'white'
            }}
        />
        <div
            ref={tooltipRef}
            className='px-3 py-2 rounded-sm bg-zinc-800 fixed text-xs'
        />
    </div>

  )
}

type BirthRateDTO = Array<{
  /**
     * Year
     */
  Key: string

  /**
     * Number of births in that year
     */
  Value: string
}>

export default BirthRateBarChart
