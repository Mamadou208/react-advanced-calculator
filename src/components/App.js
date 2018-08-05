import React, { Component } from 'react';
import Screen from './Screen';
import Keyboard from './Keyboard';
import '../App.css';

const math = require('mathjs');
const he = require('he'); // library for html entities encoding/decoding

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 0,
      log: '',
      clickedEquals: false,
      ans: 0,
    };
    this.handleLogChange = this.handleLogChange.bind(this);
    this.parenthesesAreBalanced = this.parenthesesAreBalanced.bind(this);
    this.keyClick = this.keyClick.bind(this);
  }

    // handle kyobard exeptions
  componentDidMount() {
    window.onerror = () => this.setState({ log: 'Syntax Error', clickedEquals: false });
  }

  keyClick(keyLog, math) {
    let currentLog = this.state.log;
    const clickedEquals = this.state.clickedEquals;
    if (math === 'clear') {
      this.setState({ log: '', result: 0 });
    }

    if (math === 'delete') {
      if (currentLog.charAt(currentLog.length - 2).match(/[ns]/)) {
        this.setState({ log: currentLog.slice(0, currentLog.length - 4) });
      } else {
        this.setState({ log: currentLog.slice(0, currentLog.length - 1) });
      }
    }

    if (math === 'equals') {
      const isBalanced =  this.parenthesesAreBalanced(currentLog);
    
     if(!isBalanced){
      console.log(isBalanced)
       this.setState({ log: `${currentLog.toString()})` });
       currentLog = `${currentLog.toString()})`;
       console.log(currentLog)
      }
     
      this.handleEqualsClick(currentLog);
    }

    if (math.match(/trig|log|number|comma|prnths|ans|sqrt|exponent/)) {
      if (clickedEquals) this.setState({ log: keyLog, clickedEquals: false });
      else this.setState({ log: currentLog + keyLog });
    }

    if (math.match(/sum|sub|multiply|divide|power|sqr|inv/)) {
      if (clickedEquals) this.setState({ log: `Ans${keyLog}`, clickedEquals: false });
      else this.setState({ log: currentLog + keyLog });
    }
  }

  parenthesesAreBalanced(string) {
    var parentheses = "[]{}()",
      stack = [],
      i, character, bracePosition;

    for (i = 0; character = string[i]; i++) {
      bracePosition = parentheses.indexOf(character);

      if (bracePosition === -1) { continue; }

      if (bracePosition % 2 === 0) {
        stack.push(bracePosition + 1); // push next expected brace position
      } else {
        if (stack.length === 0 || stack.pop() !== bracePosition) {
          return false;
        }
      }
    }

    return stack.length === 0;
  }

  handleEqualsClick(currentLog) {
    const times = he.decode('&#x000D7;');
    const divide = he.decode('&divide;');
    const sqrt = he.decode('&radic;');
    const sqrtReg = new RegExp(sqrt, 'g');
    const timesReg = new RegExp(times, 'g');

    // change log so it's understanable to mathjs eval() method
    const newLog = currentLog.replace(timesReg, '*')
    .replace(divide, '/')
    .replace(/Ans/g, `(${this.state.ans.toString()})`)
    .replace(/E/g, '10^')
    .replace(/log/g, 'log10')
    .replace(/ln/g, 'log')
    .replace(sqrtReg, 'sqrt');

    let result = math.eval(newLog);
    let finalResult;

    if (currentLog === '') {
      result = 0;
    }

    // trim result if too long
    if (result.toString().length > 11) {
      finalResult = result.toString().slice(0, 11);
    } else finalResult = result;

    this.setState({ ans: finalResult, result: finalResult, clickedEquals: true });
  }

  handleLogChange(input) {
    this.setState({ log: input });
  }

  render() {
    return (
      <div className="calc-container">
        <p className="description" >Numo <br /><br />
          Muiswerk Educatief</p>
        <Screen
          log={this.state.log}
          result={this.state.result}
          handleLogChange={this.handleLogChange}
        />
        <Keyboard keyClick={this.keyClick} />
      </div>
    );
  }
}

