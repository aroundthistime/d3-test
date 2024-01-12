'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useSearchParams } from 'next/navigation'

const SimpleBarGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null!)
  const searchParams = useSearchParams()

  const minParam = searchParams.get('min')
  const maxParam = searchParams.get('max')

  const drawBarGraph = (data: Readonly<PeopleData[]>) => {
    const STYLE = {
      size: {
        horizontal: 500,
        vertical: 400
      },
      padding: {
        horizontal: 20,
        vertical: 30
      },
      axis: {
        padding: {
          horizontal: 0.5,
          vertical: 0.5
        }
      }
    } as const

    const container = d3.select(containerRef.current)

    container.selectAll('*').remove()

    const svg = container
      .append('svg')
      .attr('width', STYLE.size.horizontal)
      .attr('height', STYLE.size.vertical)
      .style('border', '1px solid black')
      .style('background-color', 'white')

    svg.append('text')
      .attr('x', STYLE.size.horizontal / 2)
      .attr('y', STYLE.padding.vertical)
      .attr('text-anchor', 'middle')
      .text('Age Chart')

    const xAxisScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([STYLE.padding.horizontal, STYLE.size.horizontal - STYLE.padding.horizontal])
      .padding(STYLE.axis.padding.horizontal)

    const xAxis = d3.axisBottom(xAxisScale)

    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${STYLE.size.vertical - STYLE.padding.vertical})`)
      .attr('color', 'black')

    const yAxisScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.age))])
      .range([STYLE.size.vertical - STYLE.padding.vertical, STYLE.padding.vertical])

    const yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
      .call(yAxis)
      .attr('transform', `translate(${STYLE.padding.horizontal}, 0)`)
      .attr('color', 'black')

    svg.selectAll(null)
      .data(data)
      .join('rect')
      .attr('height', d => STYLE.size.vertical - STYLE.padding.vertical - yAxisScale(d.age))
      .attr('width', xAxisScale.bandwidth())
      .attr('x', d => xAxisScale(d.name)!)
      .attr('y', d => yAxisScale(d.age))
      .attr('fill', 'orange')
  }

  useEffect(() => {
    const data = [
      {
        name: 'John',
        age: 26
      },
      {
        name: 'Tim',
        age: 20
      },
      {
        name: 'Jane',
        age: 19
      },
      {
        name: 'Mark',
        age: 24
      },
      {
        name: 'Alice',
        age: 26
      }
    ] as const satisfies Readonly<PeopleData[]>

    drawBarGraph(data)
  }, [minParam, maxParam])

  return (
        <div ref={containerRef} className="bg-zinc-500 px-10 py-5"/>
  )
}

type PeopleData = Readonly<{
  name: string
  age: number
}>

export default SimpleBarGraph
