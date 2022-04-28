import React, { useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useState } from 'react';
import { requestClient } from '../../api/core';
import { ListData } from '../../../models/Base';
import { Enrollment } from '../../../models/Enrollment';

//——————————————— 辅助组件 ———————————————

//1.用户名点击弹框
const UserName = ({
  name,
  extensions,
}: {
  name: string;
  extensions: {} | any;
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //获取问卷答案
  const answer = (question: string) => {
    let res = extensions
      .filter((n: any) => n.name === question)
      .map((n: any) => n.value);
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

//2.审核状态变更
const RegistrationStatus = (props: {
  status: string;
  userId: string;
  url: string;
}) => {
  const { status, userId, url } = props;
  console.log(props);

  const statusName = {
    none: '未审核',
    pendingApproval: '审核中',
    approve: '通过',
    reject: '拒绝',
  } as { [key: string]: string };

  // Post
  async function postStatus(e: {} | any) {
    let status = e.target.value;
    // console.log(e.target.value, userId)
    const postUrl = url + `/${userId}/${status}`;
    // console.log("postUrl = ", postUrl)
    await requestClient<ListData<Enrollment>>(postUrl, 'POST', {});
  }

  return (
    <>
      <select name="status" id="status-select" onChange={postStatus}>
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

//TODO:需增加传入的props，用于指定baseUrl路径${hackathonName}
const Participant = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  //TODO:weopenstart替换为${hackathonName}
  let baseUrl = 'hackathon/weopenstar/enrollment';

  async function getPage() {
    const data = await requestClient<ListData<Enrollment>>(
      baseUrl + 's',
      'GET',
    );
    setEnrollments(data.value);
  }

  useEffect(() => {
    getPage();
  }, []);

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
                  url={baseUrl}
                  userId={user.id!}
                  status={status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Participant;
