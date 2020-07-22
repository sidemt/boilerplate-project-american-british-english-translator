import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const TEXTAREA = document.getElementById('text-input');
const TRANSLATED = document.getElementById('translated-sentence');
const ERROR_MSG = document.getElementById('error-msg');

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('translate-btn').addEventListener('click', translateHandler);
  document.getElementById('clear-btn').addEventListener('click', clearHandler);
});

function translateHandler(event){
  console.log('translate');
  let selection = document.getElementById('locale-select').value;
  let val = TEXTAREA.value;
  console.log('textarea', val);
  console.log('select', selection);

  if (val.length === 0){
    showError();
  }else{
    val = replaceTags(val);
    TRANSLATED.innerHTML = translate(selection, val);
  }
}

function clearHandler(event){
  console.log('clear');
  TEXTAREA.value = '';
  TRANSLATED.innerHTML = '';
  ERROR_MSG.innerHTML = '';
}

function translate(langSelection, str){
  console.log(langSelection);
  // let arr = str.split(' ');
  // console.log(arr);
  switch(langSelection){
    case 'american-to-british':
      str = checkTitles(americanToBritishTitles, str);
      str = checkWords(americanToBritishSpelling, str);
      str = checkWords(americanOnly, str);
      str = checkTimes(str);
      return str;
    case 'british-to-american':
      str = checkTitles(americanToBritishTitles, str, true);
      str = checkWords(americanToBritishSpelling, str, true);
      str = checkWords(britishOnly, str);
      str = checkTimes(str, true);
      return str;
    default:
      return str;
  }
}

function checkWords(listObj, sentence, reverse = false){
  Object.entries(listObj).map(function(element){
    let fromWord;
    let toWord;
    if (reverse){
      fromWord = element[1]
      toWord = element[0]
    }else{
      fromWord = element[0]
      toWord = element[1]
    }
    // console.log(element);
    let regex = new RegExp(`\\b(?<!\\-)${fromWord}(?!\\-)\\b`, 'gi');
    // console.log('regex')

    function keepCase(match){
      let firstLetter = match.charAt(0);

      // console.log('firstLetter', firstLetter);
      if(firstLetter.toUpperCase() === firstLetter) {
        // Raplace and capitalize the first character
        let newFirstLetter = toWord.charAt(0).toUpperCase();
        let newStr = toWord.replace(/^./, newFirstLetter);
        return '<span class="highlight">' + newStr + '</span>';
      }else{
        return '<span class="highlight">' + toWord + '</span>';
      }
    }

    sentence = sentence.replace(regex, keepCase);
  });
  // console.log(sentence);
  return sentence;
}

function checkTitles(listObj, sentence, reverse = false){
  Object.entries(listObj).map(function(element){
    let fromWord;
    let toWord;
    if (reverse){
      fromWord = element[1]
      toWord = element[0]
    }else{
      fromWord = element[0]
      toWord = element[1]
    }
    // console.log(element);
    let regex = new RegExp(`\\b${fromWord}(?=\\s)`, 'gi');
    // console.log('regex')

    function keepCase(match){
      let firstLetter = match.charAt(0);

      // console.log('firstLetter', firstLetter);
      if(firstLetter.toUpperCase() === firstLetter) {
        // Raplace and capitalize the first character
        let newFirstLetter = toWord.charAt(0).toUpperCase();
        let newStr = toWord.replace(/^./, newFirstLetter);
        return '<span class="highlight">' + newStr + '</span>';
      }else{
        return '<span class="highlight">' + toWord + '</span>';
      }
    }

    sentence = sentence.replace(regex, keepCase);
  });
  // console.log(sentence);
  return sentence;
}

function checkTimes(sentence, BritishToAmerican = false){
  let regex;
  if (BritishToAmerican){
    // British To American
    regex = /\d{1,2}\.\d{2}/gi
  }else{
    // American to British
    regex = /\d{1,2}:\d{2}/gi
  }

  function changeTimeNotation(match){
    if(BritishToAmerican){
      return '<span class="highlight">' + match.replace('.', ':') + '</span>';
    }else{
      return '<span class="highlight">' + match.replace(':', '.') + '</span>';
    }
  }

  return sentence.replace(regex, changeTimeNotation);
}

function replaceTags(str){
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  return str;
}

function removeSpan(str){
  str = str.replace(/<span class="highlight">|<\/span>/gi, '');
  return str;
}

function showError(){
  console.log('showError');
  ERROR_MSG.innerHTML = 'Error: No text to translate.';
}

/*
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    clearHandler: clearHandler,
    showError: showError,
    translateHandler: translateHandler,
    translate: translate,
    removeSpan: removeSpan
  }
} catch (e) {}
