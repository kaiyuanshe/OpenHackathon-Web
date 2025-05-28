import { LineSeries, PieSeries, SVGCharts, Title, XAxis, YAxis } from 'echarts-jsx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Col, Container, Row } from 'react-bootstrap';
import { isEmpty } from 'web-utility';

import { EnrollmentModel } from '../../models/Activity/Enrollment';
import { i18n, I18nContext } from '../../models/Base/Translation';

export interface EnrollmentStatisticChartsProps {
  store: EnrollmentModel;
}

@observer
export default class EnrollmentStatisticCharts extends ObservedComponent<
  EnrollmentStatisticChartsProps,
  typeof i18n
> {
  static contextType = I18nContext;

  componentDidMount() {
    this.props.store.getStatistic();
  }

  renderTimeline() {
    const { t } = this.observedContext,
      { createdAt = {} } = this.props.store.statistic;

    const [date, count] = Object.entries(createdAt)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce(
        (list, [date, count]) => {
          list[0].push(date);
          list[1].push(count);

          return list;
        },
        [[], []] as [string[], number[]],
      );

    return (
      <SVGCharts>
        <Title>{t('sign_up_trends')}</Title>

        <XAxis data={date} />
        <YAxis />
        <LineSeries data={count} />
      </SVGCharts>
    );
  }

  render() {
    const { t } = this.observedContext,
      { status = {}, answers = {} } = this.props.store.statistic;

    return (
      <Container fluid>
        <h2 className="my-4">{t('basic_info')}</h2>

        {this.renderTimeline()}

        <Row sm={1} md={2}>
          <Col>
            <SVGCharts>
              <Title>{t('city_distribution')}</Title>
              {/* <PieSeries
                data={Object.entries(city).map(([name, value]) => ({
                  name,
                  value,
                }))}
              /> */}
            </SVGCharts>
          </Col>
          <Col>
            <SVGCharts>
              <Title>{t('approval_status')}</Title>
              <PieSeries
                data={Object.entries(status).map(([name, value]) => ({
                  name,
                  value,
                }))}
              />
            </SVGCharts>
          </Col>
        </Row>

        <h2 className="my-4">{t('custom_questionnaire')}</h2>

        <Row sm={1} md={2}>
          {Object.entries(answers).map(
            ([title, answers]) =>
              !isEmpty(answers) && (
                <Col key={title} as="section">
                  <SVGCharts>
                    <Title>{title}</Title>
                    <PieSeries
                      data={Object.entries(answers).map(([name, value]) => ({
                        name,
                        value,
                      }))}
                    />
                  </SVGCharts>
                </Col>
              ),
          )}
        </Row>
      </Container>
    );
  }
}
