import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import EditableTable from './EditableTable';
import EditableTableRow from './EditableTableRow';
import { Button } from 'antd';

class App extends Component {
  constructor(props) {
		super(props);
		this.state = {mappings: []};
	}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Button>Default</Button>
        <EditableTable/>
        <EditableTableRow/>
      </div>
    );
  }
}

export default App;
