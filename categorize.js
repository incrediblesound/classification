var data = require('./data');
var fn = require('./hf');

var training = {};
var text;
var cleaned;
var totals = {};
totals.overall = 0;

fn.forEach(data.data, function(set){ //for each category we count the ocurrance of each non-blacklisted word
  if(!training[set.cat]) { 
    training[set.cat] = {};
    totals[set.cat] = 0;
    totals.overall += 1;
  } else {
    totals.overall += 1;
  }
  text = set.txt.split(' ');
  fn.forEach(text, function(word){
    cleaned = fn.cleaner(word);
    if(cleaned && !(fn.check(cleaned))){
      if(!training[set.cat][cleaned]){
        training[set.cat][cleaned] = 1;
      } else {
        training[set.cat][cleaned] += 1; 
      }
      totals[set.cat] += 1;
    }
  })
})

//now our training object contains a list of the # of occurrances of each word in each 
//category, we turn that number into % probability by dividing by the total word count
fn.forEach(training, function(stats, category){
  fn.forEach(training[category], function(num, word){
    num = num/totals[category]*100;
    training[category][word] = num;
  })
})

var testArray;
var results = {};

//For each test line this function creates an objects with an array
//containing the probability of each word in the test line 
//to occur in each category
fn.forEach(data.tests, function(testLine, i){ 
  results[i] = {};
  results[i]['text'] = testLine;
  testArray = testLine.split(' ');
  fn.forEach(testArray, function(word){
    cleaned = fn.cleaner(word);
    if(cleaned) { //this just checks to make sure we in fact have a word
      fn.forEach(training, function(stats, category){
        if(!results[i][category]) {
          results[i][category] = [];
        }
        if(training[category][cleaned] !== undefined){ 
        results[i][category].push(training[category][cleaned]);
        }
      })
    }
  })
})

//then we multiply the probabilities of each word for each category together and then 
//multiply the total by the probability of each category to occur in the data set
fn.forEach(results, function(testCase){
  fn.forEach(training, function(stats, category){
    testCase[category] = fn.multiply(testCase[category])*(totals[category]/totals.overall);  
  })
})

console.log(results);
