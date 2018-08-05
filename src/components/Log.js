import React from 'react';

export default class Log extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogChange = this.handleLogChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', () => this.ref.focus());
  }

  componentDidUpdate() {
    this.ref.focus();
  }

  handleLogChange() {
    this.props.handleLogChange(this.ref.value);
  }
  
  render() {
    return (
      <input
        type="text"
        className="log"
        ref={(a) => { this.ref = a; }}
        value={this.props.log}
        onChange={this.handleLogChange}
        readOnly
        autoFocus
      />
    );
  }
}

