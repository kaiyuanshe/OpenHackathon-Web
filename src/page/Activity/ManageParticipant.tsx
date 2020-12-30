import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import { Table, TableRow } from 'boot-cell/source/Content/Table';

import { user } from '../../model';
import { PageFrame } from '../../component/Navbar';
import menu from './menu.json';

@observer
@component({
    tagName: 'manage-participant',
    renderTarget: 'children'
})
export class ManageParticipant extends mixin() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        this.classList.add('d-block', 'container-md');

        user.getRegistratiors(this.name);

        super.connectedCallback();
    }

    render() {
        const { loading } = user;

        return (
            <PageFrame menu={menu}>
                <Button
                    type="submit"
                    color="success"
                    className="mt-3"
                    disabled={loading}
                >
                    通过
                </Button>
                <Button
                    type="submit"
                    color="danger"
                    className="mt-3"
                    disabled={loading}
                >
                    拒绝
                </Button>
                <ToggleField
                    type="checkbox"
                    switch
                    className="float-right mt-3"
                >
                    允许组队
                </ToggleField>
                <ToggleField
                    type="checkbox"
                    switch
                    className="float-right mt-3"
                >
                    自动通过
                </ToggleField>
                <Table className="mt-2" small>
                    <TableRow type="head">
                        <th scope="col">
                            <ToggleField type="checkbox"> </ToggleField>
                        </th>
                        <th scope="col">#</th>
                        <th scope="col">注册名</th>
                        <th scope="col">邮箱</th>
                        <th scope="col">登录方式</th>
                        <th scope="col">联系电话</th>
                        <th scope="col">联系地址</th>
                        <th scope="col">报名时间</th>
                        <th scope="col">状态</th>
                    </TableRow>

                    {user.activeList.map((e, i) => (
                        <TableRow>
                            <th scope="col">
                                <ToggleField type="checkbox"> </ToggleField>
                            </th>
                            <th scope="col">{i + 1}</th>
                            <td scope="col">{e.name}</td>
                            <td scope="col">{e.emails[0].email}</td>
                            <td scope="col">{e.provider}</td>
                            <td scope="col">{e.profile?.phone}</td>
                            <td scope="col">{e.profile?.address}</td>
                            <td scope="col">{e.create_time}</td>
                            <td scope="col" style={{ width: '150px' }}>
                                <FormField is="select">
                                    {['未审核', '通过', '拒绝', '自动通过'].map(
                                        e => (
                                            <option>{e}</option>
                                        )
                                    )}
                                </FormField>
                            </td>
                        </TableRow>
                    ))}
                </Table>
            </PageFrame>
        );
    }
}
