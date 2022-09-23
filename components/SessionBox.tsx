import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { HTMLAttributes, UIEvent, PureComponent } from 'react';
import { Modal } from 'react-bootstrap';
import dynamic from 'next/dynamic';

import sessionStore from '../models/Session';

const AuthingGuard = dynamic(() => import('./AuthingGuard'), { ssr: false });

export interface SessionBoxProps extends HTMLAttributes<HTMLDivElement> {
  auto?: boolean;
}

@observer
export class SessionBox extends PureComponent<SessionBoxProps> {
  @observable
  cover = false;

  openDialog = ({ target }: UIEvent<HTMLElement>) =>
    !(target as HTMLElement).closest('#session-dialog') && (this.cover = true);

  render() {
    const { cover } = this,
      { auto, children, ...props } = this.props,
      { user } = sessionStore;

    return (
      <div
        {...props}
        onKeyDownCapture={user || auto ? undefined : this.openDialog}
        onClickCapture={user || auto ? undefined : this.openDialog}
      >
        {(user || !auto) && children}

        {!user && (
          <Modal
            id="session-dialog"
            backdrop={auto ? 'static' : true}
            show={auto || cover}
            onHide={() => (this.cover = false)}
          >
            <Modal.Body>
              {/* @ts-ignore */}
              <AuthingGuard onLogin={profile => sessionStore.signIn(profile)} />
            </Modal.Body>
          </Modal>
        )}
      </div>
    );
  }
}
