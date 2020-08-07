var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

// get the gdp data from importing json
var gdpData

// size of the svg we need to set
width = '1000'
height = '800'
padding = '40'

// main 4 scales we need to make

// width which needs to each bar 
let widthScale
// height which need to each bar 
let heightScale
// scale for x axis
let xAxisScale
// scale for y axis
let yAxisScale

// making the svg
const canverce = () =>{
    
    d3.select('body').append('svg').attr('width',width)
    .attr('height', height)
    
}

// creating the scales
const genarateScales = () => {

    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(gdpData,(item) => item[1])])
                    .range([0,height-(2*padding)])

    widthScale = d3.scaleLinear()
                   .domain([0,gdpData.length-1])
                   .range([padding,width-padding])

    yAxisScale = d3.scaleLinear()
                   .domain([0,d3.max(gdpData,(item) => item[1])])
                   .range([height-padding,padding])

    let dateArray = gdpData.map((item) => {
                        return new Date(item[0])               
    }) 

    console.log(dateArray)

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(dateArray),d3.max(dateArray)])
                   .range([padding,width-padding])

    console.log('scaledone')
}


// inputing x and y axis into svg
const appendAxis = () => {
    let svg = d3.select('svg')
    
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
    .attr('transform','translate(0,'+(height - padding)+')')
    .call(xAxis)
    .attr('id',"x-axis")
    

    svg.append('g')
    .call(yAxis)
    .attr('transform','translate('+(padding)+',0)')
    .attr('id',"y-axis")

    console.log('append done')
}

// inputing bars to the svg
const appendBars = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .style('visibility','hidden')
                    .style('width','auto')
                    .style('height','auto')
                    .attr('id',"tooltip")
    
    let svg = d3.select('svg')

    svg.selectAll('rect')
    .data(gdpData)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('data-date',(d) => {return d[0] })
    .attr('data-gdp',(d) =>{return d[1]})
    // each bar will get this width (every bar has same width)
    .attr('width', (width - (2*padding))/gdpData.length)
    // each bar will get this height (if the svg is 500 then how can we input a 1000 bar. 
    // thats why we getting a new value from the **heightScale**) Separate values for each bar
    .attr('height',(d,i) => { return heightScale(d[1])})
    // position bars. normally we use i*30 like that. but how can we get that 30 value. thats where widthScale comes.
    // it gives a correct value
    .attr('x',(d,i) => {return widthScale(i)})
    // position the heights
    .attr('y',(d,i) => {return height - padding - heightScale(d[1])})
    .attr('fill', 'blue')
    .on('mouseover', (item)=> {
        tooltip.transition()
            .style('visibility','visible')
    })
    .on('mouseout', (item) => {
        tooltip.transition()
            .style('visibility', 'hidden')
        document.querySelector('#tooltip').setAttribute("data-date",item[0])
        tooltip.text(item[0])
        // tooltip.attr('data-date',item[0]) 
        // -- this is ok. but when we use this fdd test is missing.
        
    })
    

}

const req = new XMLHttpRequest;
req.open("GET",url,true)
req.onload = function(){
    const data = JSON.parse(req.responseText)
    gdpData = (data['data'])
    console.log(gdpData)

    canverce()
    genarateScales()
    appendAxis()
    appendBars()
}
req.send()


