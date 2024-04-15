import React, { useState } from 'react';
import { Table, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const dataSource = [
  { key: '1', name: 'John', age: 32, cityOptions: ['New York', 'London', 'Tokyo'] },
  { key: '2', name: 'Alice', age: 28, cityOptions: ['Paris', 'Sydney', 'Berlin'] },
];

const DynamicSelectTable = () => {
  const [selectedCities, setSelectedCities] = useState({});

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          defaultValue={record.cityOptions[0]}
          mode="multiple"
          onChange={(value) => handleChange(value, record.key)}
        >
          {record.cityOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const handleChange = (value, key) => {
    setSelectedCities((prevSelectedCities) => ({
      ...prevSelectedCities,
      [key]: value,
    }));
  };


  console.log('Selected Cities:', selectedCities);
  const getData = () => {
    axios({
      url: 'http://192.168.1.152:8003/project/getProjectAll/T00356',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: 'post'
    }).then(
      res => {
        console.log(res);
      }
    )
}

  return <Table dataSource={dataSource} columns={columns} />;
};

export default DynamicSelectTable;