import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

export type UserAddressProps = Partial<Record<'email' | 'github', string>>;

export const UserAddress: FC<UserAddressProps> = ({ email, github }) => (
  <address className="mb-0">
    {email && (
      <a rel="noreferrer" target="_blank" href={'mailto:' + email}>
        <FontAwesomeIcon icon={faEnvelope} />
      </a>
    )}
    {github && (
      <a rel="noreferrer" className="ms-2" target="_blank" href={github}>
        <FontAwesomeIcon icon={faGithub} />
      </a>
    )}
  </address>
);
