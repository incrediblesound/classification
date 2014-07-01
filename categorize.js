var data = require('./data');
var blackList = ['a','on','the','i','in','was','had','with','this','that','of','to','me','you','do','my','is','are','today','and','we','it']

var check = function(word){
  var result = false;
  forEach(blackList, function(black){
    if(word == black){ result = true; }
  })
  return result;
}

var forEach = function(collection, iterator) {
    if(collection.length) {
      for(var i = 0; i < collection.length; ++i) {
        iterator(collection[i], i, collection);
      }
    } else {
      var index = -1;
      for(var x in collection) {
        if(collection.hasOwnProperty(x)) {
          index += 1;
          iterator(collection[x], x, collection);
        }
      }
    }
};

var multiply = function(array) {
  var result = 1;
  forEach(array, function(integer){
    result = result*integer;
  })
  return result;
}

var cleaner = function(word) {
  if(!/[A-Za-z]/.test(word)) {
    return false;
  }
	word = word.toLowerCase();
	if(!/[a-z]/.test(word[word.length-1])) {
		word = word.substring(0, word.length-1);
	}
	return word;
}

//the fun starts here
var training = {};
var text;
var cleaned;
var totals = {};
totals.overall = 0;

forEach(data.data, function(set){ //for each category we count the ocurrance of each non-blacklisted word
	if(!training[set.cat]) { 
		training[set.cat] = {};
    totals[set.cat] = 0;
    totals.overall += 1;
	} else {
    totals.overall += 1;
  }
  text = set.txt.split(' ');
  forEach(text, function(word){
    cleaned = cleaner(word);
    if(cleaned && !(check(cleaned))){
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
forEach(training, function(stats, category){
  forEach(training[category], function(num, word){
    num = num/totals[category]*100;
    training[category][word] = num;
  })
})

var testArray;
var results = {};

//For each test line this function creates an objects with an array
//containing the probability of each word in the test line 
//to occur in each category
forEach(data.tests, function(testLine, i){ 
  results[i] = {};
  results[i]['text'] = testLine;
  testArray = testLine.split(' ');
  forEach(testArray, function(word){
    cleaned = cleaner(word);
    if(cleaned) { //this just checks to make sure we in fact have a word
      forEach(training, function(stats, category){
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
forEach(results, function(testCase){
  forEach(training, function(stats, category){
    testCase[category] = multiply(testCase[category])*(totals[category]/totals.overall);  
  })
})

console.log(results);
