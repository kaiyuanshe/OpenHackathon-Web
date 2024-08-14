import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';

import { PageHead } from '../../../../../../../components/layout/PageHead';
import {
  WorkEditor,
  WorkEditorProps,
} from '../../../../../../../components/Team/WorkEditor';
import { ServerSessionBox } from '../../../../../../../components/User/ServerSessionBox';
import { i18n } from '../../../../../../../models/Base/Translation';

const { t } = i18n;

export type TeamWorkEditProps = RouteProps<
  Record<keyof WorkEditorProps, string>
> &
  JWTProps;

export const getServerSideProps = compose<WorkEditorProps, TeamWorkEditProps>(
  router,
  jwtVerifier(),
  translator(i18n),
);

export default function WorkCreatePage(props: TeamWorkEditProps) {
  const { name, tid, wid } = props.route.params!;

  return (
    <ServerSessionBox {...props}>
      <PageHead title={t('edit_work')} />

      <WorkEditor {...{ name, wid }} tid={+tid} />
    </ServerSessionBox>
  );
}
