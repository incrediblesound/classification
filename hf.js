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

exports.forEach = forEach;

exports.cleaner = function(word) {
  if(!/[A-Za-z]/.test(word)) {
    return false;
  }
  word = word.toLowerCase();
  if(!/[a-z]/.test(word[word.length-1])) {
    word = word.substring(0, word.length-1);
  }
  return word;
}

var blackList = ['a','on','the','i','in','was','had','with','this','that','of','to','me','you','do','my','is','are','today','and','we','it']

exports.check = function(word){
  var result = false;
  forEach(blackList, function(black){
    if(word == black){ result = true; }
  })
  return result;
}

exports.multiply = function(array) {
  var result = 1;
  forEach(array, function(integer){
    result = result*integer;
  })
  return result;
}

exports.sort = function(array, key) {
  var sort = true;
  var temp;
  while(sort){
    sort = false;
    for(var i = 0; i<array.length-1; i++) {
      if(array[i][key] > array[i+1][key]) {
      temp = array[i];
      array[i] = array[i+1];
      array[i+1] = temp;
      sort = true;
      }
    }
  }
  return array;
}