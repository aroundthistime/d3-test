/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ceilWithBiggestDigit } from '@/utils/math'
import { useBirthRateQuery } from '@/queries/birthrate/useBirthRateQuery'
import { type BirthRateData } from '@/queries/birthrate/types'

const BirthRateLineChart = () => {
  const { data } = useBirthRateQuery()

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

  const drawChart = (data: BirthRateData) => {
    const container = d3.select(containerRef.current)

    container.selectAll('*').remove()

    const xAxisScale = d3.scaleUtc()
      .domain(d3.extent(data, d => d.year) as [Date, Date])
      .range([STYLE.margin.left, STYLE.size.width - STYLE.margin.right])

    container.append('g')
      .call(d3.axisBottom(xAxisScale))
      .attr('transform', `translate(0, ${STYLE.size.height - STYLE.margin.bottom})`)
      .attr('color', 'currentColor`')

    const yAxisScale = d3.scaleLinear()
      .domain([0, ceilWithBiggestDigit(Math.max(...data.map(d => d.birth)))])
      .range([STYLE.size.height - STYLE.margin.bottom, STYLE.margin.top])

    container.append('g')
      .call(d3.axisLeft(yAxisScale))
      .attr('transform', `translate(${STYLE.margin.left}, 0)`)
      .attr('color', 'currentColor')
      .call(g => g.append('text')
        .attr('transform', `translate(0, ${STYLE.margin.top / 2})`)
        .attr('fill', 'currentColor')
        .text('Births')
      )

    const line = d3.line()
      .x(d => xAxisScale(d.year))
      .y(d => yAxisScale(d.birth))

    container.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(data))
  }

  useEffect(() => {
    if (data) {
      drawChart(data)
    }
  }, [data])

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
              color='black'
          />
          <div
              ref={tooltipRef}
              className='px-3 py-2 rounded-sm bg-zinc-800 fixed text-xs'
          />
      </div>
  )
}

export default BirthRateLineChart
