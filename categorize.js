var data = require('./data');
var blackList = ['a','on','the','i','in','of','to','do','my','is','are','today','and','we']

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

forEach(data.data, function(set){ //for each category we count the ocurrance of each non-blacklisted word
	if(!training[set.cat]) { 
		training[set.cat] = {};
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
    }
  })
})

forEach(training.happy, function(num, word){ //the num of ocurrances is turned into a percent (probability)
  num = num/5*100;
  training.happy[word] = num;
})

forEach(training.sad, function(num, word){
  num = num/5*100;
  training.sad[word] = num;
})

var testArray;
var results = {};

//this function creates two arrays for each test line containing the probabilities of
//each word to occur in the happy and sad categories respectively
forEach(data.tests, function(testLine, i){ 
  results[i] = {};
  results[i]['text'] = testLine;
  results[i]['happy'] = [];
  results[i]['sad'] = [];
  testArray = testLine.split(' ');
  forEach(testArray, function(word){
    cleaned = cleaner(word);
    if(cleaned && (training.happy[cleaned] !== undefined)){ 
      results[i]['happy'].push(training.happy[cleaned]);
    }
    if(cleaned && (training.sad[cleaned] !== undefined)){
      results[i]['sad'].push(training.sad[cleaned]);
    }
  })
})

//finally we multiply by the probability of each category ocurring in the data set
forEach(results, function(testCase){
  testCase.happy = multiply(testCase.happy)*0.5;
  testCase.sad = multiply(testCase.sad)*0.5;
  if(testCase.happy > testCase.sad) {
    testCase['category'] = 'happy';
  } else {
    testCase['category'] = 'sad';
  }
})

console.log(results);
