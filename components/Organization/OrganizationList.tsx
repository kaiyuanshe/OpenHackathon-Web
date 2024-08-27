import { Organizer } from '@kaiyuanshe/openhackathon-service';
import { FC } from 'react';
import { Form, Image, Table } from 'react-bootstrap';

import { OrganizerTypeName } from '../../models/Activity/Organization';
import { i18n } from '../../models/Base/Translation';
import styles from '../../styles/Table.module.less';
import { XScrollListProps } from '../layout/ScrollList';
import { OrganizationCard } from './OrganizationCard';

const { t } = i18n;

export const OrganizationListLayout: FC<XScrollListProps<Organizer>> = ({
  defaultData = [],
}) => (
  <ul className="list-unstyled">
    {defaultData.map(item => (
      <li className="mb-2" key={item.id}>
        <OrganizationCard {...item} />
      </li>
    ))}
  </ul>
);

export const OrganizationTableLayout: FC<XScrollListProps<Organizer>> = ({
  defaultData = [],
  selectedIds = [],
  onSelect,
}) => (
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
            ref={(input: HTMLInputElement | null) => {
              if (input)
                input.indeterminate =
                  !!selectedIds?.length &&
                  selectedIds.length < defaultData.length;
            }}
            onChange={() =>
              onSelect?.(
                selectedIds.length === defaultData.length
                  ? []
                  : defaultData.map(({ id }) => id),
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
              checked={selectedIds?.includes(id)}
              onClick={
                onSelect &&
                (({ currentTarget: { checked } }) => {
                  if (checked) return onSelect([...selectedIds, id]);

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
          <td>{OrganizerTypeName[type]}</td>
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
