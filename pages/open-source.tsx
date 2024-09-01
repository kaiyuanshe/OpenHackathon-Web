import { User } from '@kaiyuanshe/openhackathon-service';
import { Contributor, GitRepository } from 'mobx-github';
import { observer } from 'mobx-react';
import { cache, compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { GitCard, SimpleRepository } from '../components/Git/Card';
import { PageHead } from '../components/layout/PageHead';
import { TopUserList } from '../components/User/TopUserList';
import { i18n } from '../models/Base/Translation';
import { SourceRepository, SourceRepositoryModel } from '../models/Git';

interface OpenSourcePageProps {
  repositories: GitRepository[];
  contributors: Contributor[];
}

export const getServerSideProps = compose<{}, OpenSourcePageProps>(
  cache(),
  translator(i18n),
  async () => {
    const repositoryStore = new SourceRepositoryModel();

    const contributors = await repositoryStore.getAllContributors(),
      repositories = repositoryStore.allItems;

    return { props: { repositories, contributors } };
  },
);

const { t } = i18n;

const OpenSourcePage: FC<OpenSourcePageProps> = observer(
  ({ repositories, contributors }) => (
    <Container>
      <PageHead title={t('open_source_code')} />
      <h1 className="my-5 text-center">{t('open_source_code')}</h1>

      {[...SourceRepository].reverse().map((list, index, { length }) => (
        <section key={index}>
          <h2 className="my-4">v{length - index}</h2>

          <Row as="ul" className="list-unstyled g-3">
            {list.map(name => {
              const repository = repositories.find(
                ({ full_name }) => full_name === name,
              );
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
      <TopUserList
        value={contributors.map(
          ({ id, login, avatar_url, contributions }, index) => ({
            userId: id!,
            user: { id, name: login, avatar: avatar_url } as User,
            score: contributions,
            rank: index + 1,
          }),
        )}
      />
    </Container>
  ),
);
export default OpenSourcePage;
