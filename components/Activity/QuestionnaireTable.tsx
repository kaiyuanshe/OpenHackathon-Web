import { Button, Table } from 'react-bootstrap';

import { Question } from '../../models/Question';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export interface QuestionnaireTableProps {
  questionnaire: Question[];
  onDelete: (id: string) => void;
  onMove: (id: string, direction: number) => void;
}

export function QuestionnaireTable({
  questionnaire,
  onDelete,
  onMove,
}: QuestionnaireTableProps) {
  const typeMap = {
    text: t('text'),
    url: t('link'),
  };

  return (
    <div className="container-fluid">
      <Table responsive className="my-3">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('question_id')}</th>
            <th>{t('question_description')}</th>
            <th>{t('question_type')}</th>
            <th>{t('option_config')}</th>
            <th>{t('whether_multiple')}</th>
            <th>{t('whether_required')}</th>
            <th>{t('operation')}</th>
          </tr>
        </thead>
        <tbody>
          {questionnaire.map(
            ({ id, title, options, multiple, type, required }, index) => (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{id}</td>
                <td>{title}</td>
                <td>{type ? typeMap[type] : '--'}</td>
                <td>{options ? options?.join(';') : '--'}</td>
                <td>
                  {options && typeof multiple === 'boolean'
                    ? multiple
                      ? t('multiple')
                      : t('not_multiple')
                    : '--'}
                </td>
                <td>{required ? t('yes') : t('no')}</td>
                <td>
                  {index === 0 ? null : (
                    <Button variant="link" onClick={() => onMove(id!, -1)}>
                      {t('move_up')}
                    </Button>
                  )}

                  {index === questionnaire.length - 1 ? null : (
                    <Button variant="link" onClick={() => onMove(id!, 1)}>
                      {t('move_down')}
                    </Button>
                  )}
                  <Button variant="link" onClick={() => onDelete(id!)}>
                    {t('delete')}
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </div>
  );
}
