import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Form, Image, Table } from 'react-bootstrap';

import {
  Organization,
  OrganizationModel,
  OrganizationTypeName,
} from '../../models/Organization';
import styles from '../../styles/Table.module.less';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { OrganizationCard } from './OrganizationCard';

export interface OrganizationListProps extends ScrollListProps<Organization> {
  store: OrganizationModel;
}

export const OrganizationListLayout = ({
  value = [],
}: Pick<OrganizationListProps, 'value'>) => (
  <ul className="list-unstyled">
    {value.map(item => (
      <li key={item.id} className="p-2">
        <OrganizationCard {...item} />
      </li>
    ))}
  </ul>
);

@observer
export class OrganizationList extends ScrollList<OrganizationListProps> {
  store = this.props.store;

  renderList() {
    return <OrganizationListLayout value={this.store.allItems} />;
  }
}

export const OrganizationTableLayout = ({
  value = [],
  selectedIds = [],
  onSelect,
}: Omit<OrganizationListProps, 'store'>) => (
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
                  : value.map(({ id }) => String(id)),
              )
            }
          />
        </th>
        <th>{t('name')}</th>
        <th>{t('introduction')}</th>
        <th>{t('type')}</th>
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
              checked={selectedIds?.includes(String(id))}
              onClick={
                onSelect &&
                (({ currentTarget: { checked } }) => {
                  if (checked) return onSelect([...selectedIds, String(id)]);

                  const index = selectedIds.indexOf(String(id));

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
          <td>{OrganizationTypeName[type]}</td>
          <td>
            {logo! && (
              <Image
                width="48"
                src={logo?.uri}
                alt={logo?.description || description}
                title={logo?.name || name}
              />
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

@observer
export class OrganizationTable extends ScrollList<OrganizationListProps> {
  store = this.props.store;

  renderList() {
    return (
      <OrganizationTableLayout
        {...this.props}
        value={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
      />
    );
  }
}
