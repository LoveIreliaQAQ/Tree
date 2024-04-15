import React, { useEffect, useState } from 'react';
import { Space, Switch, Table, Select, Col, Row, Button, Spin} from 'antd';
import axios from 'axios'
const App = () => {

  const { Option } = Select;
  //获得页面地址
  const searchParams = new URLSearchParams(window.location.search);
  const parameterValue = searchParams.get('agile.18041');
  console.log('查询到的参数的值',parameterValue); // 输出特定查询参数的值
  useEffect(() => {
    console.log("数据合集", allNeedData);
  }, );
  //设置加载中按钮的状态
  const [loading, setLoading] = useState(false);
  //设置初始数据
  const [originalData, setOriginalData] = useState([]);
  //设置扁平数据
  const [easyData, setEasyData] = useState([]);
  //获取总数据
  useState(() => {
    axios({
      // url: 'http://192.168.1.187:8003/project/getProjectAll/PROJECT0000034',
      // url: 'http://192.168.1.169:8005/project/getProjectAll/T00356',
      url: 'http://192.168.1.169:8005/project/getProjectAll/'+parameterValue,

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: 'get'
    }).then(
      res => {
        console.log("axios返回值是",res.data);
      //   //将数据扁平化
      //   function flatten(data) {
      //     return data.reduce((prev, cur) => {
      //         prev.push({ id: cur.id, 
      //                     label: cur.label,
      //                     responsibleDepartment:cur.responsibleDepartment,
      //                     projectMember:cur.projectMember,
      //                     participant:cur.participant,

      //                   });
      //         if (cur.children) {
      //             prev.push(...flatten(cur.children));
      //         }
      //         return prev;
      //     }, []);
      // }
      //将数据扁平化
      function flatten(data) {
        return data.reduce((prev, cur) => {
            prev.push({ id: cur.id, 
                        label: cur.label,
                        responsibleDepartment:cur.responsibleDepartment,
                        projectMember:cur.projectMember,
                        participant:cur.participant,
                        key:cur.id
                      });
            if (cur.children) {
                prev.push(...flatten(cur.children));
            }
            return prev;
        }, []);
    }
      

      //添加key给树形结构的每一个对象
      function addKeysToTreeData(data) {
        return data.map((item, index) => {
          const itemWithKey = {
            ...item,
            key: item.id // 使用 id 作为 key
          };
          
          if (item.children) {
            itemWithKey.children = addKeysToTreeData(item.children); // 递归处理子节点
          }
          
          return itemWithKey;
        });
      }
      const newData = addKeysToTreeData(res.data);
      setOriginalData(newData);

      //把key添加给扁平化处理后的数组
      const flatData = flatten(res.data);
      setEasyData(flatData.map((item, index) => ({
          ...item,
          key: item.id  // 使用索引作为 key
        })))
        
      }
    )
    })
  console.log("树状数据",originalData)
  console.log("扁平数据",easyData)
  
//设制表头格式
const columns = [
  {
    title: '项目计划',
    dataIndex: 'label',
    key: 'projectPlan',
  },
  {
    title: '责任部门',
    dataIndex: 'responsibleDepartment',
    key: 'responsibilityDepartment',
    width: '15%',
    render: (text, record) => (
      <Select
        style={{ width: 120 }}
        defaultValue={record.responsibleDepartment}
        mode="multiple"
        // onChange={(value) => handleSelectChange(value, record)}
      >
        {/* {record.responsibleDepartment.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))} */}
      </Select>
    ),
  },
  {
    title: '责任人员',
    dataIndex: 'personLiable',
    key: 'address',
    width: '15%',
      render: (text, record) => (
      <Select
        style={{ width: 120 }}
        defaultValue={record.personLiable}
        mode="multiple"
        onChange={(value) => handleSelectChangePersonLiable(value, record)}
      >
        {record.governor.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    ),

  },
  {
    title: "参与人员",
    dataIndex: "participant",
    key: "options",
    width: '20%',
    render: (text, record) => (
      <Select
        style={{ width: 300 }}
        defaultValue={record.groupMember}
        mode="multiple"
        onChange={(value) => handleSelectChangeParticipant(value, record)}
      >
        {record.participant.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    ),
  },
];

//处理树形结构的子节点
const removeChildrenFromRecord = (record) => {
  if (record.children && record.children.length > 0) {
    // 递归处理每个子节点
    const newChildren = record.children.map(child => removeChildrenFromRecord(child));
    // 返回一个新对象，不包含 children 属性
    return { ...record, children: newChildren };
  } else {
    // 如果没有子节点，直接返回当前节点，不包含 children 属性
    return { ...record, children: [] };
  }
};

//储存需要的数据
const [allNeedData, setAllNeedData] = useState([]);

//修改责任人员的点击事件
const handleSelectChangePersonLiable = (value, record, type) => {
  const updatedData = originalData.map(item => {
    if (item.id === record.id) {
      return {
        ...item,

      };
    }
    return item;
  });
  setOriginalData(updatedData);

  console.log('Modified Record:', record);
  console.log('selected',value);
  // 创建包含更新 personLiable 后的 record 对象
  const updatedRecord = {
    ...record,
    personLiable: value
  };

  // 去掉 record 的子节点
  const recordWithoutChildren = removeChildrenFromRecord(updatedRecord);
  console.log('修改后的责任人员数据',recordWithoutChildren)
  // 将更新后的 record 添加到 allNeedData 中
  setAllNeedData([...allNeedData, recordWithoutChildren]);
  // const needData=record;
  // needData.personLiable=value
  // console.log('修改后的责任人员数据',needData)

  // setAllNeedData([...allNeedData, needData]);
  // console.log("数据合集",allNeedData)
};

//修改参与人员的点击事件
const handleSelectChangeParticipant = (value, record, type) => {
  const updatedData = originalData.map(item => {
    if (item.id === record.id) {
      return {
        ...item,

      };
    }
    return item;
  });
  setOriginalData(updatedData);
  console.log('Modified Record:', record);
  console.log('selected',value);
  const needData=record;
  needData.participant=value
  console.log('修改后的参与人员数据',needData)
  setAllNeedData([...allNeedData, needData]);
  console.log("修改数据合集",allNeedData)

};

const updateProjectAll=()=>{
  const formData = new FormData();
  console.log("提交前的allNeedData",allNeedData)
  formData.append("修改一次", allNeedData)

  axios({
    url: 'http://192.168.1.169:8005/project/updateProjectAll',
    
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: 'put',
    data:formData,
  }).then(
    res => {
      console.log("返回值是",res.data);
      
    }
  )
}

  return (
    <>
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
      <Col span={3}><Button type="primary" >责任人分配</Button></Col>
      <Col span={3}><Button type="primary">参与人员分配</Button></Col>
      </Row>
      <Table
        expandable={{ defaultExpandAllRows: true }} // 默认展开所有行
        columns={columns}
        dataSource={originalData}
      />
    </>
  );
};
export default App;
