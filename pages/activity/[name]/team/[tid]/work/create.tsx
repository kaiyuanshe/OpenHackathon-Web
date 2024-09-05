import { compose, router, translator } from 'next-ssr-middleware';

import { PageHead } from '../../../../../../components/layout/PageHead';
import {
  WorkEditor,
  WorkEditorProps,
} from '../../../../../../components/Team/WorkEditor';
import { i18n } from '../../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../../api/core';
import { TeamWorkEditProps } from './[wid]/edit';

export const getServerSideProps = compose<WorkEditorProps>(
  router,
  sessionGuard,
  translator(i18n),
);

const { t } = i18n;

export default function WorkCreatePage(props: TeamWorkEditProps) {
  const { name, tid, wid } = props.route.params!;

  return (
    <>
      <PageHead title={t('submit_work')} />

      <WorkEditor {...{ name, wid }} tid={+tid} />
    </>
  );
}
