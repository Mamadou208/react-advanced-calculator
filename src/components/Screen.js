import React, { Component } from 'react';
import Result from './Result';
import Log from './Log';

export default class Screen extends Component {
  render() {
    return (
      <div className="screen">
        <Log log={this.props.log} handleLogChange={this.props.handleLogChange} />
        <Result result={this.props.result} />
      </div>
    );
  }
}

