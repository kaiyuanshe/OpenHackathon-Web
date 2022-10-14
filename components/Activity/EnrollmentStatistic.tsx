import { isEmpty } from 'web-utility';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  SVGCharts,
  Title,
  XAxis,
  YAxis,
  LineSeries,
  PieSeries,
} from 'echarts-jsx';

import { EnrollmentModel } from '../../models/Enrollment';

export interface EnrollmentStatisticChartsProps {
  store: EnrollmentModel;
}

@observer
export default class EnrollmentStatisticCharts extends PureComponent<EnrollmentStatisticChartsProps> {
  componentDidMount() {
    this.props.store.getStatistic();
  }

  renderTimeline() {
    const { createdAt = {} } = this.props.store.statistic;

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
        <Title>报名趋势</Title>

        <XAxis data={date} />
        <YAxis />
        <LineSeries data={count} />
      </SVGCharts>
    );
  }

  render() {
    const {
      city = {},
      status = {},
      extensions = {},
    } = this.props.store.statistic;

    return (
      <Container fluid>
        <h2 className="my-4">基本信息</h2>

        {this.renderTimeline()}

        <Row sm={1} md={2}>
          <Col>
            <SVGCharts>
              <Title>城市分布</Title>
              <PieSeries
                data={Object.entries(city).map(([name, value]) => ({
                  name,
                  value,
                }))}
              />
            </SVGCharts>
          </Col>
          <Col>
            <SVGCharts>
              <Title>审核状态</Title>
              <PieSeries
                data={Object.entries(status).map(([name, value]) => ({
                  name,
                  value,
                }))}
              />
            </SVGCharts>
          </Col>
        </Row>

        <h2 className="my-4">自定义问卷</h2>

        <Row sm={1} md={2}>
          {Object.entries(extensions).map(
            ([title, answers]) =>
              !isEmpty(answers) && (
                <Col as="section">
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
