import {
    WebCellProps,
    component,
    mixin,
    attribute,
    watch,
    createCell
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formToJSON } from 'web-utility/source/DOM';

import { Table, TableRow } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import { Image } from 'boot-cell/source/Media/Image';
import { FormField } from 'boot-cell/source/Form/FormField';

import { AdminFrame } from '../../../component/AdminFrame';
import menu from './menu.json';
import { activity, Award, AwardTarget } from '../../../model';

const AwardTargetName = {
    [AwardTarget.individual]: '个人',
    [AwardTarget.team]: '团队'
};

export interface ManageAwardProps extends WebCellProps {
    name: string;
}

@observer
@component({
    tagName: 'manage-award',
    renderTarget: 'children'
})
export class ManageAward extends mixin<ManageAwardProps>() {
    @attribute
    @watch
    name = '';

    async connectedCallback() {
        const { name } = this;

        super.connectedCallback();

        if (name !== activity.current.name) await activity.getOne(name);

        await activity.award.getNextPage({}, true);
    }

    handleSave = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const data = formToJSON(event.target as HTMLFormElement);

        activity.award.updateOne(data);
    };

    renderItem = ({ quantity, target, pictures, name, description }: Award) => (
        <TableRow>
            <td>{quantity}</td>
            <td>{target}</td>
            <td>
                <Image fluid src={pictures?.[0].uri} />
            </td>
            <td>{name}</td>
            <td>{description}</td>
            <td>
                <Button size="sm" color="danger">
                    删除
                </Button>
            </td>
        </TableRow>
    );

    render({ name }: ManageAwardProps) {
        const { list } = activity.award;

        return (
            <AdminFrame menu={menu} name={name}>
                <div className="row">
                    <form className="col-6" onSubmit={this.handleSave}>
                        <FormField
                            name="name"
                            required
                            label="名称"
                            labelColumn={2}
                        />
                        <FormField
                            name="description"
                            label="描述"
                            labelColumn={2}
                        />
                        <FormField
                            type="number"
                            name="quantity"
                            value="1"
                            label="权重"
                            labelColumn={2}
                        />
                        <FormField
                            is="select"
                            name="target"
                            label="类型"
                            labelColumn={2}
                        >
                            {Object.entries(AwardTargetName).map(
                                ([value, name]) => (
                                    <option value={value}>{name}</option>
                                )
                            )}
                        </FormField>
                        <footer className="d-flex">
                            <Button type="reset" color="danger" block>
                                清空表单
                            </Button>
                            <Button
                                type="submit"
                                color="success"
                                block
                                className="mt-0 ml-3"
                            >
                                新增奖项
                            </Button>
                        </footer>
                    </form>
                    <Table className="col-6 mt-2" small center>
                        <TableRow type="head">
                            <th>权重</th>
                            <th>类型</th>
                            <th>照片</th>
                            <th>名称</th>
                            <th>描述</th>
                            <th>操作</th>
                        </TableRow>

                        {list.map(this.renderItem)}
                    </Table>
                </div>
            </AdminFrame>
        );
    }
}
