function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadata = d3.select("#sample-metadata")
      // Use `.html("") to clear any existing metadata
    sampleMetadata.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]){
      var row = sampleMetadata.append('P');
      row.text(`${key}: ${value}`)
    });

  })};
   

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleX = data.otu_ids;
    var bubbleY = data.sample_values;
    var bubbleSize = data.sample_values;
    var bubbleColor = data.otu_ids;
    var bubbleText = data.otu_labels;

    var trace1 = {
      x: bubbleX,
      y: bubbleY,
      text: bubbleText,
      mode: 'markers',
      marker: {
        color: bubbleColor,
        size: bubbleSize
      },
    };
    var layout = {
      xaxis: {title: 'OTU ID'},
      height: 400,
      width: 1200
    };

    var data = [trace1];

    Plotly.newPlot('bubble', data, layout);
    
    // @TODO: Build a Pie Chart
    d3.json(`/samples/${sample}`).then(function(data){
    var pieValue = data.sample_values.slice(0,10);
    var pieLabels = data.otu_ids.slice(0,10);
     
    var data = [{
      values: pieValue,
      labels: pieLabels,
      type: 'pie'
    }];
    
    Plotly.newPlot('pie', data);
    });
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
