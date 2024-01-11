'use client'

import { useEffect, useRef } from "react"
import * as d3 from 'd3'
import { getRandomValueWithinRange } from "@/utils/math"
import { useSearchParams } from "next/navigation"

const SimpleBarGraph = () => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const searchParams = useSearchParams()

    const minParam = searchParams.get('min')
    const maxParam = searchParams.get('max')

    const createDummyData = (range: Range) => {
        const DATA_SIZE = 10 as const;

        const {
            min,
            max
        } = range;

        const data = Array.from({length: DATA_SIZE}, () => getRandomValueWithinRange(min,max))
        return data;
    }

    useEffect(() => {
        const range: Range = {
            min: minParam !== null ? parseInt(minParam) : 0,
            max: maxParam !== null ? parseInt(maxParam) : 1000
        }

        const data = createDummyData(range);

        const scaleWidth = d3.scaleLinear()
            .domain([0, range.max])
            .range([0, 400])

        const container = d3.select(containerRef.current)
        .style('background-color', 'white')
        .style('padding', '20px')

        container.selectAll('*')
            .remove()

        container.selectAll(null)
            .data(data)
            .join('div')
            .attr("id", (d) => `bar-${d}`)
            .text(d => d)
            .style('background-color', 'lightgray')
            .style('margin', '1px')
            .style('width', d => `${scaleWidth(d)}px`)

    }, [minParam, maxParam])

    return (
        <div ref={containerRef}/>
    )
}

type Range = Readonly<Record<'min' | 'max', number>>

export default SimpleBarGraph;