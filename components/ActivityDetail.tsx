import React from "react";
import Link from 'next/link';
import { Activity } from "../pages/api/Activity";
import { Container, Row, Col, Button, Carousel, Image } from "react-bootstrap";
import { Media } from "../pages/api/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faLocationDot, faUsers } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const ActivityDetail: React.FC<{ activity: Activity }> = ({ activity }) => {
  return <Container>
    <Row xs={1} sm={1} lg={2}>
      <div id="activityDetailCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"
                  aria-current="true" aria-label="Slide 1" />
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                  aria-label="Slide 2" />
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                  aria-label="Slide 3" />
        </div>
        <div className="carousel-inner">
          {activity.banners.map((banner: Media, index: number) => {
            return <div key={index} className={`carousel-item ${index == 0 ? "active" : ""}`}>
              <img src={banner.uri} className="d-block w-100" alt={activity.name} />
            </div>;
          })}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"/>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"/>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="d-flex flex-column justify-content-start">
        <h2>{activity.displayName}</h2>
        <aside className="pb-2">
          {activity.tags.map((tag, index) => {
            return <span key={index} className="badge bg-success me-2">{tag}</span>
          })}
        </aside>
        <Row key="enrollment">
          <label className="col-lg-3 col-md-4">报名时段
          {/*<label className="auto">报名时段*/}
            {' '}<FontAwesomeIcon className="text-success" icon={faCalendarDay} />
          </label>
          <p className="col-auto">{convertDatetime(activity.enrollmentStartedAt)  + " ~ " +  convertDatetime(activity.enrollmentEndedAt)}</p>
        </Row>
        <Row key="activity">
          <label className="col-lg-3 col-md-4">活动时段
            {' '}<FontAwesomeIcon className="text-success" icon={faCalendarDay} />
          </label>
          <p className="col-auto">{convertDatetime(activity.eventStartedAt) + " ~ " + convertDatetime(activity.eventEndedAt)}</p>
        </Row>
        <Row key="location">
          <label className="col-lg-3 col-md-4">活动地址
            {' '}<FontAwesomeIcon className="text-success" icon={faLocationDot} />
          </label>
          <p className="col-auto">{activity.location}</p>
        </Row>
        <Row key="number">
          <label className="col-lg-3 col-md-4">报名人数
            {' '}<FontAwesomeIcon className="text-success" icon={faUsers} />
          </label>
          <p className="col-auto">{activity.location}</p>
        </Row>
        <Link href={{ pathname: "/activity/register", query: {name: activity.name}}} passHref>
          <a role="button" className="col-3 btn btn-success">报名</a>
        </Link>
      </div >
    </Row>
    <Row>

    </Row>
  </Container>;
};

function convertDatetime(datetime : string) :string {
  return moment(new Date(datetime)).format("YYYY-MM-DD HH:mm:ss");
}

export default ActivityDetail;