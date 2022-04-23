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

  handleSave = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = event.target as HTMLFormElement;
      const data = formToJSON(form);

      await activity.award.updateOne(data);
      activity.award.clearCurrent();
      form.reset();
  };

  handleClear = (event: Event) => {
      const { id } = formToJSON<Partial<Award>>(
          event.target as HTMLFormElement
      );
      if (!id) return;

      event.preventDefault();
      activity.award.clearCurrent();
  };

  renderForm() {
      const {
          id = '',
          name = '',
          description = '',
          quantity,
          target
      } = activity.award.current;

      return (
          <form
              className="col-4"
              onSubmit={this.handleSave}
              onReset={this.handleClear}
          >
              <input type="hidden" name="id" value={id} />
              <FormField
                  name="name"
                  required
                  label="名称"
                  labelColumn={2}
                  value={name}
              />
              <FormField
                  name="description"
                  label="描述"
                  labelColumn={2}
                  value={description}
              />
              <FormField
                  type="number"
                  name="quantity"
                  label="权重"
                  labelColumn={2}
                  value={quantity + ''}
              />
              <FormField
                  is="select"
                  name="target"
                  label="类型"
                  labelColumn={2}
              >
                  {Object.entries(AwardTargetName).map(([value, name]) => (
                      <option value={value} selected={value === target}>
                          {name}
                      </option>
                  ))}
              </FormField>
              <footer className="d-flex">
                  <Button type="reset" color="danger" block>
                      清空表单
                  </Button>
                  <Button
                      className="mt-0 ml-3"
                      type="submit"
                      color={id ? 'warning' : 'success'}
                      block
                  >
                      {id ? '更新' : '新增'}奖项
                  </Button>
              </footer>
          </form>
      );
  }

  renderItem = ({
      quantity,
      target,
      pictures,
      name,
      description,
      id
  }: Award) => (
      <TableRow>
          <td>{quantity}</td>
          <td>{AwardTargetName[target]}</td>
          <td>
              <Image fluid src={pictures?.[0].uri} />
          </td>
          <td>
              <Button color="link" onClick={() => activity.award.getOne(id)}>
                  {name}
              </Button>
          </td>
          <td>{description}</td>
          <td>
              <Button
                  size="sm"
                  color="danger"
                  onClick={() => activity.award.deleteOne(id)}
              >
                  删除
              </Button>
          </td>
      </TableRow>
  );

  render({ name }: ManageAwardProps) {
      const { loading, list } = activity.award;

      return (
          <AdminFrame menu={menu} name={name} loading={loading}>
              <div className="row">
                  {this.renderForm()}

                  <Table className="col-8 mt-2" small center>
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