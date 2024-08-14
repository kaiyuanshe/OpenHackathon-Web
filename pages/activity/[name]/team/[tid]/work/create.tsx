import { compose, jwtVerifier, router, translator } from 'next-ssr-middleware';

import { PageHead } from '../../../../../../components/layout/PageHead';
import {
  WorkEditor,
  WorkEditorProps,
} from '../../../../../../components/Team/WorkEditor';
import { ServerSessionBox } from '../../../../../../components/User/ServerSessionBox';
import { i18n } from '../../../../../../models/Base/Translation';
import { TeamWorkEditProps } from './[wid]/edit';

export const getServerSideProps = compose<WorkEditorProps, TeamWorkEditProps>(
  router,
  jwtVerifier(),
  translator(i18n),
);

const { t } = i18n;

export default function WorkCreatePage(props: TeamWorkEditProps) {
  const { name, tid, wid } = props.route.params!;

  return (
    <ServerSessionBox {...props}>
      <PageHead title={t('submit_work')} />

      <WorkEditor {...{ name, wid }} tid={+tid} />
    </ServerSessionBox>
  );
}
