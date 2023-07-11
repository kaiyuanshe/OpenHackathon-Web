import { observer } from 'mobx-react';
import { Form, Image, Table } from 'react-bootstrap';

import {
  Organization,
  OrganizationModel,
  OrganizationTypeName,
} from '../../models/Organization';
import { i18n } from '../../models/Translation';
import styles from '../../styles/Table.module.less';
import { XScrollList, XScrollListProps } from '../layout/ScrollList';
import { OrganizationCard } from './OrganizationCard';

const { t } = i18n;

export interface OrganizationListProps extends XScrollListProps<Organization> {
  store: OrganizationModel;
}

export const OrganizationListLayout = ({
  defaultData = [],
}: Pick<OrganizationListProps, 'defaultData'>) => (
  <ul className="list-unstyled">
    {defaultData.map(item => (
      <li className="mb-2" key={item.id}>
        <OrganizationCard {...item} />
      </li>
    ))}
  </ul>
);

export const OrganizationTableLayout = ({
  defaultData = [],
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
              selectedIds?.length > 0 &&
              selectedIds?.length === defaultData?.length
            }
            ref={(input: HTMLInputElement | null) =>
              input &&
              (input.indeterminate =
                !!selectedIds?.length &&
                selectedIds.length < defaultData.length)
            }
            onChange={() =>
              onSelect?.(
                selectedIds.length === defaultData.length
                  ? []
                  : defaultData.map(({ id }) => String(id)),
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
      {defaultData.map(({ id, name, description, type, logo }) => (
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
export class OrganizationTable extends XScrollList<OrganizationListProps> {
  store = this.props.store;

  constructor(props: OrganizationListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <OrganizationTableLayout
        {...this.props}
        defaultData={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
      />
    );
  }
}
