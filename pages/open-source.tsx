import { UserRankView } from 'idea-react';
import { Contributor, GitRepository } from 'mobx-github';
import { observer } from 'mobx-react';
import { cache, compose } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { GitCard, SimpleRepository } from '../components/Git/Card';
import { PageHead } from '../components/layout/PageHead';
import { I18nContext } from '../models/Base/Translation';
import { SourceRepository, SourceRepositoryModel } from '../models/Git';

interface OpenSourcePageProps {
  repositories: GitRepository[];
  contributors: Contributor[];
}

export const getServerSideProps = compose<{}, OpenSourcePageProps>(cache(), async () => {
  const repositoryStore = new SourceRepositoryModel();

  const contributors = await repositoryStore.getAllContributors(),
    repositories = JSON.parse(JSON.stringify(repositoryStore.allItems));

  return { props: { repositories, contributors } };
});

const OpenSourcePage: FC<OpenSourcePageProps> = observer(({ repositories, contributors }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('open_source_code')} />
      <h1 className="my-5 text-center">{t('open_source_code')}</h1>

      {[...SourceRepository].reverse().map((list, index, { length }) => (
        <section key={index}>
          <h2 className="my-4">v{length - index}</h2>

          <Row as="ul" className="list-unstyled g-3">
            {list.map(name => {
              const repository = repositories.find(({ full_name }) => full_name === name);

              return (
                <Col key={name}>
                  <GitCard
                    className="h-100"
                    {...(repository as SimpleRepository)}
                    renderController={() => <></>}
                  />
                </Col>
              );
            })}
          </Row>
        </section>
      ))}

      <h2 className="my-4">{t('team_members')}</h2>
      <UserRankView
        style={{
          // @ts-expect-error remove in React 19
          '--logo-image':
            'url(https://hackathon-api.static.kaiyuanshe.cn/6342619375fa1817e0f56ce1/2022/10/09/logo22.jpg)',
        }}
        title={t('hacker_pavilion')}
        rank={contributors.map(({ id, login, avatar_url, email, html_url, contributions }) => ({
          id: id!,
          name: login!,
          avatar: avatar_url,
          email,
          website: html_url,
          score: contributions,
        }))}
        linkOf={({ website }) => website!}
      />
    </Container>
  );
});
export default OpenSourcePage;
