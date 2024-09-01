import { User } from '@kaiyuanshe/openhackathon-service';
import { Contributor, GitRepository } from 'mobx-github';
import { observer } from 'mobx-react';
import { cache, compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

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
      <h1 className="text-center">{t('open_source_code')}</h1>

      {SourceRepository.map((list, index) => (
        <section key={index}>
          <h2>v{index + 1}</h2>

          <ul className="list-unstyled d-flex flex-wrap gap-3 justify-content-around align-items-center">
            {list.map(name => {
              const repository = repositories.find(
                ({ full_name }) => full_name === name,
              );
              return (
                <GitCard key={name} {...(repository as SimpleRepository)} />
              );
            })}
          </ul>
        </section>
      ))}

      <h2>{t('team_members')}</h2>
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
