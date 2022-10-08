import { observer } from 'mobx-react';
import {
  Organization,
  OrganizationModel,
  OrganizationTypeName,
} from '../../models/Organization';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { Form, Image, Table } from 'react-bootstrap';
import styles from '../../styles/Table.module.less';

export interface OrganizationListProps extends ScrollListProps<Organization> {
  store: OrganizationModel;
}

@observer
export class OrganizationList extends ScrollList<OrganizationListProps> {
  store = this.props.store;

  static Layout = ({
    value = [],
    selectedIds = [],
    onSelect,
  }: OrganizationListProps) => (
    <Table hover responsive="lg" className={styles.table}>
      <thead>
        <tr>
          <th>
            <Form.Check
              inline
              type="checkbox"
              name="organizationId"
              checked={
                selectedIds?.length > 0 && selectedIds?.length === value?.length
              }
              ref={(input: HTMLInputElement | null) =>
                input &&
                (input.indeterminate =
                  !!selectedIds?.length && selectedIds.length < value.length)
              }
              onChange={() =>
                onSelect?.(
                  selectedIds.length === value.length
                    ? []
                    : value.map(({ id }) => id),
                )
              }
            />
          </th>
          <th>名称</th>
          <th>介绍</th>
          <th>类型</th>
          <th>logo</th>
        </tr>
      </thead>
      <tbody>
        {value.map(({ id, name, description, type, logo }) => (
          <tr key={id}>
            <td>
              <Form.Check
                inline
                type="checkbox"
                name="organizationId"
                checked={selectedIds?.includes(id)}
                onClick={
                  onSelect &&
                  (({ currentTarget: { checked } }) => {
                    if (checked)
                      return onSelect(
                        [...selectedIds, id],
                        // [...selectedIds, id].uniqueBy(),
                      );
                    const index = selectedIds.indexOf(id);

                    onSelect([
                      ...selectedIds.slice(0, index),
                      ...selectedIds.slice(index + 1),
                    ]);
                  })
                }
              />
            </td>
            <td>{name}</td>
            <td>{description}</td>
            {/*<td>{type}</td>*/}
            <td>{OrganizationTypeName[type]}</td>
            <td>
              {logo! && (
                <Image
                  width="48"
                  src={logo?.uri}
                  alt={
                    logo?.description === null ? description : logo.description
                  }
                  title={logo?.name === null ? name : logo.name}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
