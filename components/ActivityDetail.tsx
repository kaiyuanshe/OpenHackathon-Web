import React from 'react';
import { Activity } from '../pages/api/Activity';

const ActivityDetail : React.FC<{ activity : Activity }> = ({ activity }) => {
  return <h1>{activity.name}</h1>;
};

export default ActivityDetail;