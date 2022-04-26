import { User } from './User';

export interface Enrollment {
  createdAt: '2008-01-14T04:33:35Z';
  updatedAt: '2008-01-14T04:33:35Z';
  hackathonName: 'foo';
  userId: '1';
  user: User;
  status: 'approved';
  extensions: [
    {
      name: 'mykey';
      value: 'myvalue';
    },
  ];
}
