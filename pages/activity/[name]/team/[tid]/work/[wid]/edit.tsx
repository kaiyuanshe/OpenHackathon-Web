import { observer } from 'mobx-react';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';
import { FC } from 'react';

import { PageHead } from '../../../../../../../components/layout/PageHead';
import {
  WorkEditor,
  WorkEditorProps,
} from '../../../../../../../components/Team/WorkEditor';
import { i18n, t } from '../../../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../../../api/core';

export type TeamWorkEditProps = RouteProps<
  Record<keyof WorkEditorProps, string>
>;

export const getServerSideProps = compose<WorkEditorProps>(
  router,
  sessionGuard,
  translator(i18n),
);

const WorkCreatePage: FC<TeamWorkEditProps> = observer(props => {
  const { name, tid, wid } = props.route.params!;

  return (
    <>
      <PageHead title={t('edit_work')} />

      <WorkEditor {...{ name, wid }} tid={+tid} />
    </>
  );
});
export default WorkCreatePage;
