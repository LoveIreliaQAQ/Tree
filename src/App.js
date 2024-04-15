import React, { useEffect, useState } from 'react';
import { Space, Switch, Table, Select, Col, Row, Button} from 'antd';
import axios from 'axios'
const App = () => {

  const { Option } = Select;
  const [originalData, setOriginalData] = useState([]);

  //获取总数据
  useState(() => {
    axios({
      url: 'http://192.168.1.152:8003/project/getProjectAll/T00356',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: 'get'
    }).then(
      res => {
        console.log("axios返回值是",res.data);
        const childrenData = [];
        const getChildrenData = (node) => {
          if (node.children) {
            node.children.forEach(child => {
              childrenData.push(child); // 将当前节点的 children 数据添加到数组中
              getChildrenData(child); // 递归获取子节点的 children 数据
            });
          }
        };
        getChildrenData(res.data);
        console.log('输出所有 children 数据',childrenData); // 输出所有 children 数据
        
        setOriginalData(res.data)
      }
    )
    })
    console.log("初始数据",originalData)


//预设制表头
const columns = [
  {
    title: '项目计划',
    dataIndex: 'name',
    key: 'projectPlan',
  },
  {
    title: '责任部门',
    dataIndex: 'responsibilityDepartment',
    key: 'responsibilityDepartment',
    width: '15%',
  },
  {
    title: '责任人员',
    dataIndex: 'responsibilityPersonnel',
    key: 'address',
    width: '15%',
  },
  {
    title: "参与人员",
    dataIndex: "responsibilityPersonnel",
    key: "options",
    width: '20%',
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    render: (text, record) => (
      <Select
        style={{ width: 120 }}
        // defaultValue={record[0].childrencityOptions[0]}
        mode="multiple"
        // onChange={(value) => handleChange(value, record.children.key)}
      >
        {/* {record.cityOptions.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))} */}
      </Select>
    ),
  },
];


//预设制数据
const data = [
  {
    key: 1,
    name: 'Watch',
    children: [
      {
        key: 11,
        name: 'Kick off',
        children: [
          {
            key: 111,
            name: 'Project information',
            children: [
              {
                key: 1111,
                name: 'Project Code',
                responsibilityDepartment:'NPM',
                cityOptions: ['New York', 'London', 'Tokyo']
              },
              {
                key: 1112,
                name: 'Down stream',
                responsibilityDepartment:'IO',
                cityOptions: ['Paris', 'Sydney', 'Berlin']
              },
            ],
          },
          {
            key: 112,
            name: 'Team memeber DRI',
            children: [
              {
                key: 1121,
                name: 'Team Member List',
                responsibilityDepartment:'PC'
              },
              {
                key: 1122,
                name: 'Kick Off Meeting',
                responsibilityDepartment:'Sales'
              },
            ],
          },
        ],
      },
    ],
  }
];


//递归寻找options
const findOptions = (data) => {
  const options = [];

  const extract = (items) => {
    items.forEach(item => {
      if (item.children) {
        extract(item.children);
      } else {
        options.push(
          <Option key={item.key} value={item.cityOptions}>
            {item.cityOptions}
          </Option>
        );
      }
    });
  };
  
  extract(data);
  return options
};

const newoptions = findOptions(data);
console.log("1",newoptions);
//默认表格选中事件
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const [selectedCities, setSelectedCities] = useState({});
const handleChange = (value, key) => {
  setSelectedCities((prevSelectedCities) => ({
    ...prevSelectedCities,
    [key]: value,
  }));
};

    //选择参与员工
    const [selectedOption, setSelectedOption] = useState("");
    //处理选中的事件
    const handleSelectChange = (value) => {
      setSelectedOption(value);
    };

    

  return (
    <>
      <button>点击获取数据</button>
      <Row gutter={[16, 16]} style={{marginBottom: 20,marginTop: 20,marginLeft: 10}}>
      <Col span={6}>项目组别:<Select
      defaultValue="Jade NPI Watch组"
      style={{
        width: 180,
      }}
      options={[
        {
          value: 'jack',
          label: 'Jack',
        },
        {
          value: 'Jade NPI Watch组',
          label: 'Jade NPI Watch组',
        },
        {
          value: 'Yiminghe',
          label: 'yiminghe',
        },
        {
          value: 'disabled',
          label: 'Disabled',
          disabled: true,
        },
      ]}
    /></Col>
      <Col span={6}></Col>
      <Col span={6}></Col>
      <Col span={3}><Button type="primary">责任人分配</Button></Col>
      <Col span={3}><Button type="primary">参与人员分配</Button></Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
      />
    </>
  );
};
export default App;
