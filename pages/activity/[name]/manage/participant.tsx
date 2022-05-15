import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { requestClient } from '../../../api/core';
import { ListData } from '../../../../models/Base';
import { Enrollment } from '../../../../models/Enrollment';
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import styles from '../../../../styles/participant.less';

//——————————————— 辅助组件 ———————————————

//0.获取动态路由
export async function getServerSideProps({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) {
  if (!name)
    return {
      notFound: true,
    };

  return {
    props: {
      activity: name,
      path: req.url,
    },
  };
}

//1.用户名点击弹框
const UserName = ({
  name,
  extensions,
}: {
  name: string;
  extensions: Enrollment['extensions'];
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          {extensions.map((n, index) => {
            return (
              <div key={index}>
                <strong>{n.name}</strong>
                <p>{n.value}</p>
              </div>
            );
          })}
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

//静态数据statusName放在辅助组件2外，减少重复渲染
const statusName = {
  approved: '通过',
  rejectd: '拒绝',
  none: '未审核',
  pendingApproval: '审核中',
} as { [key: string]: string };
//2.审核状态变更
const RegistrationStatus = (props: {
  status: string;
  userId: string;
  url: string;
}) => {
  const { status, userId, url } = props;
  console.log('状态 = ', props);

  // Post
  async function postStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    let status = e.currentTarget.value;
    let state: string =
      status === 'approved' ? 'approve' : status === 'rejectd' ? 'reject' : '';

    console.log(e.currentTarget.value, userId);
    if (state) {
      const postUrl = `${url}/${userId}/${state}`;
      // console.log("postUrl = ", postUrl)
      await requestClient<ListData<Enrollment>>(postUrl, 'POST', {});
    }
  }

  return (
    <Form.Control
      as="select"
      name="status"
      id="status-select"
      onChange={postStatus}
      className={styles.form}
    >
      <option value={status}>{statusName[status]}</option>
      {Object.keys(statusName)
        .filter(key => key !== status)
        .map(key => ({ label: statusName[key], value: key }))
        .map(s => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
    </Form.Control>
  );
};

//——————————————— 主体组件 ———————————————

//TODO:测试post。

const Participant = (props: { activity: string; path: string }) => {
  const { activity, path } = props;
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  //NOTE：跳转页面的时候${activity}会变成data？
  console.log('props = ', props, path);

  let baseUrl = `hackathon/${activity}/enrollment`;

  async function getPage() {
    const { value } = await requestClient<ListData<Enrollment>>(
      baseUrl + 's',
      'GET',
    );
    setEnrollments(value);
    console.log('value = ', value);
  }

  useEffect(() => {
    getPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ActivityManageFrame path={path}>
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
            {enrollments.map(
              ({ user, status, extensions, createdAt }, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>
                    <UserName name={user.nickname} extensions={extensions} />
                  </td>
                  <td>{user.email}</td>
                  <td>{user.registerSource[0].split(':')[1]}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  {/* 只取T之前的时间（UTC） */}
                  <td>{createdAt.split('T')[0]}</td>

                  <td>
                    <RegistrationStatus
                      url={baseUrl}
                      userId={user.id!}
                      status={status}
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </div>
    </ActivityManageFrame>
  );
};

export default Participant;
