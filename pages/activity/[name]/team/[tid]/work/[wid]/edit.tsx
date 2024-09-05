import { compose, RouteProps, router, translator } from 'next-ssr-middleware';

import { PageHead } from '../../../../../../../components/layout/PageHead';
import {
  WorkEditor,
  WorkEditorProps,
} from '../../../../../../../components/Team/WorkEditor';
import { i18n } from '../../../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../../../api/core';

const { t } = i18n;

export type TeamWorkEditProps = RouteProps<
  Record<keyof WorkEditorProps, string>
>;

export const getServerSideProps = compose<WorkEditorProps>(
  router,
  sessionGuard,
  translator(i18n),
);

export default function WorkCreatePage(props: TeamWorkEditProps) {
  const { name, tid, wid } = props.route.params!;

  return (
    <>
      <PageHead title={t('edit_work')} />

      <WorkEditor {...{ name, wid }} tid={+tid} />
    </>
  );
}
