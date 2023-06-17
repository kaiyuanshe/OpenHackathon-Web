import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Container, Table } from 'react-bootstrap';

import { Question } from '../../models/Question';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export interface QuestionnaireTableProps {
  questionnaire: Question[];
  onDelete: (id: string) => void;
  onMove: (id: string, direction: number) => void;
}

export const QuestionnaireTable: FC<QuestionnaireTableProps> = observer(
  ({ questionnaire, onDelete, onMove }) => {
    const typeMap = {
      text: t('text'),
      url: t('link'),
      '--': '--',
    };

    return (
      <Container fluid>
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
              (
                { id, title, options, multiple, type, required },
                index,
                { length },
              ) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{typeMap[type || '--']}</td>
                  <td>{options?.join(';') || '--'}</td>
                  <td>
                    {options
                      ? multiple
                        ? t('multiple')
                        : t('not_multiple')
                      : '--'}
                  </td>
                  <td>{required ? t('yes') : t('no')}</td>
                  <td>
                    {!!index && (
                      <Button variant="link" onClick={() => onMove(id!, -1)}>
                        {t('move_up')}
                      </Button>
                    )}

                    {index !== length - 1 && (
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
      </Container>
    );
  },
);
