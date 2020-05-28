(function (d3) {
    'use strict';

    const svg = d3.select('svg'); //select all with svg tab

    const height = +svg.attr('height'); //recall + is same as parseFloat()
    const width = +svg.attr('width');

    const circle = svg.append('circle');

    const g = svg.append('g') //group element (parent)
        .attr('transform',`translate( ${width / 2}, ${height / 2} )`);

    circle
        .attr('r', height/2)
        .attr('cx', width/2)
        .attr('cy', height/2)
        .attr('fill','yellow')
        .attr('stroke','black');

    const eyeSpacing = 100;
    const eyeYOffset = -70;
    const eyeRadius = 30;

    const eyesGroup = g.append('g')
        .attr('transform',`translate(0, ${eyeYOffset} )`);

    const leftEye = eyesGroup.append('circle')
        .attr('r', eyeRadius)
        .attr('cx',-eyeSpacing);

    const rightEye = eyesGroup.append('circle')
        .attr('r', eyeRadius)
        .attr('cx',eyeSpacing);

    const mouth = g.append('path')
        .attr('d',d3.arc()({
            innerRadius: 80,
            outerRadius: 100,
            startAngle: Math.PI / 2,
            endAngle: Math.PI * 3/2
        }));

}(d3));
