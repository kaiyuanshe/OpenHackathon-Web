import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export type TopUserAddressProps = Partial<Record<'email' | 'github', string>>;

export const TopUserAddress = ({ email, github }: TopUserAddressProps) => (
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
