import React, { useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useState } from 'react';
import { requestClient } from '../../api/core';
import { ListData } from '../../../models/Base';
import { Enrollment } from '../../../models/Enrollment';

// type Props = {
//   name: string;
// }

// 1.
// const UserName = ({ name }: Props) => {
// }

// 2.
// const UserName = (props: Props) => {
//   const { name } = props;
// }

// 3.
// const UserName = ({ name } : { name: string }) => {

// NOTE: 改变属性会渲染两次

//——————————————— 辅助组件 ———————————————

//1.用户名——点击弹框
const UserName = ({ name, extensions }: { name: string; extensions: {} }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //获取问卷答案
  const answer = (question: string) => {
    let res = extensions.filter(n => n.name === question).map(n => n.value);
    console.log('res = ', res);
    return res;
  };

  return (
    <>
      <Button variant="link" onClick={handleShow}>
        {name}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>参赛者问卷</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>您的专业</b>
          <span>{answer('您的专业')}</span>
          <br />
          <b>常用的编程语言</b>
          <span>{answer('常用的编程语言')}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            返回
          </Button>
          <Button variant="primary" onClick={handleClose}>
            确认
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

//4.状态——下拉菜单（状态显示要改一下） TODO:PUT
const RegistrationStatus = (props: {
  status: string;
  onChange: (value: string) => void;
}) => {
  const { status, onChange } = props;

  const statusName = {
    none: '未审核',
    pendingApproval: '审核中',
    approved: '通过',
    rejected: '拒绝',
  } as { [key: string]: string };

  const getStatus = e => {
    onChange(e.target.value);
  };

  // xia xie yi bo
  // XD XDDD
  return (
    <>
      <select name="status" id="status-select" onChange={getStatus}>
        <option value={status}>{statusName[status]}</option>
        {Object.keys(statusName)
          .filter(key => key !== status)
          .map(key => ({ label: statusName[key], value: key }))
          .map(s => {
            return (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            );
          })}
      </select>
    </>
  );
};

//——————————————— 主体组件 ———————————————

const Participant = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [status, setStatus] = useState('');

  async function getPage() {
    const data = await requestClient<ListData<Enrollment>>(
      `hackathon/weopenstar/enrollments`,
      'GET',
    );
    setEnrollments(data.value);
  }

  // niubi
  //变更数据后重新刷新，修改[]

  useEffect(() => {
    getPage();
  }, [status]);

  console.log('status', status);

  return (
    <div className="participant-table">
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>注册名</th>
            <th>邮箱</th>
            <th>登录方式</th>
            <th>联系电话</th>
            <th>联系地址</th>
            <th>报名时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(({ user, status, extensions }, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                <UserName name={user.nickname} extensions={extensions} />
              </td>
              <td>{user.email}</td>
              <td>{user.registerSource}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.email}</td>
              <td>
                <RegistrationStatus
                  status={status}
                  onChange={e => {
                    setStatus(e);
                  }}
                />
              </td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Participant;
