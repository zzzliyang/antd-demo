import React, { Component } from 'react';
import './EditableTable.css';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import axios from 'axios';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class EditableTableRow extends React.Component {
  componentDidMount() {
		axios.get('http://localhost:8080/mappings')
    .then(data => this.setState({
      data: data.data,
      count: data.data.length + 1
    }));
	};
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'id',
      dataIndex: 'id',
      width: '5%',
      render: (text, record) => this.renderColumns(text, record, 'id'),
    }, {
      title: 'source',
      dataIndex: 'source',
      width: '25%',
      render: (text, record) => this.renderColumns(text, record, 'source'),
    }, {
      title: 'sourceName',
      dataIndex: 'sourceName',
      width: '25%',
      render: (text, record) => this.renderColumns(text, record, 'sourceName'),
    }, {
      title: 'destinationName',
      dataIndex: 'destinationName',
      width: '25%',
      render: (text, record) => this.renderColumns(text, record, 'destinationName'),
    }, {
      title: 'Action',
      dataIndex: 'operationEdit',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.key)}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                : <a onClick={() => this.edit(record.key)}>Edit</a>
            }
          </div>
        );
      },
    }, {
      title: '',
      dataIndex: 'operationDelete',
      render: (text, record) => {
        return (
          this.state.data.length > 1 ?
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href="javascript:;">Delete</a>
            </Popconfirm>
          ) : null
        );
      },
    }];
    this.state = { data: [], count: 0 };
    this.cacheData = this.state.data.map(item => ({ ...item }));
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  onDelete = (key) => {
    const data = [...this.state.data];
    this.setState({ data: data.filter(item => item.key !== key) });
  }
  handleAdd = () => {
    const { count, data } = this.state;
    const newData = {
      id: count,
      source: `Edward King ${count}`,
      sourceName: 'test',
      destinationName: `London, Park Lane no. ${count}`,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
  }
  render() {
    return (
      <div>
        <Button className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <Table bordered rowKey="id" dataSource={this.state.data} columns={this.columns} />
      </div>
    );
  }
}

export default EditableTableRow;
