import { observer } from 'mobx-react';
import { compose, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';

import { PageHead } from '../../../../../../components/layout/PageHead';
import { WorkEditor, WorkEditorProps } from '../../../../../../components/Team/WorkEditor';
import { I18nContext } from '../../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../../api/core';
import { TeamWorkEditProps } from './[wid]/edit';

export const getServerSideProps = compose<WorkEditorProps>(router, sessionGuard);

const WorkCreatePage: FC<TeamWorkEditProps> = observer(props => {
  const { t } = useContext(I18nContext),
    { name, tid, wid } = props.route.params!;

  return (
    <>
      <PageHead title={t('submit_work')} />

      <WorkEditor {...{ name, wid }} tid={+tid} />
    </>
  );
});
export default WorkCreatePage;
