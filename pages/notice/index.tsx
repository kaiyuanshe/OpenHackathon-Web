
import { InferGetServerSidePropsType } from 'next';
import Table from 'react-bootstrap/Table';
import noticeStore from '../../models/Notice';

export async function getServerSideProps() {
    const list = await noticeStore.getList({}, 1, 12);

    return { props: { list } };
}

const NoticeListPage = ({
    list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const listItems = list.map((notice) =>{
        return <tr>
            <td>{notice.hackathonName}</td>
            <td>{notice.id}</td>
            <td>{notice.content}</td>
        </tr>
    }
    );
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>公告名称</th>
                    <th>链接</th>
                    <th>类型</th>
                </tr>
            </thead>
            <tbody>
                {listItems}
            </tbody>
        </Table>
    )
};

export default NoticeListPage;