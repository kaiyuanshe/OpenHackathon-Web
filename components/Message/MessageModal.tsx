import { observer } from 'mobx-react';
import { NewData } from 'mobx-restful';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { Message, MessageModel, MessageTypeName } from '../../models/Message';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export interface MessageModalProps extends Pick<ModalProps, 'show' | 'onHide'> {
  store: MessageModel;
  onSave?: () => any;
}

@observer
export class MessageModal extends PureComponent<MessageModalProps> {
  private form = createRef<HTMLFormElement>();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store } = this.props || {},
      form = this.form.current;

    if (!store || !form) return;

    const data = formToJSON<NewData<Message>>(form);

    await store.updateOne(data, store.currentOne.id);
    await store.refreshList();

    store.clearCurrent();
    form.reset();
  };

  handleReset = () => {
    this.form.current?.reset();
    this.props.onHide?.();
  };

  render() {
    const { show, onHide, store } = this.props;
    const { content, title } = store.currentOne,
      loading = store.uploading > 0;

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('publish_announcement')}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          as="form"
          ref={this.form}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
        >
          <Form.Group className="mt-2" controlId="title">
            <Form.Label>{t('title')}</Form.Label>
            <Form.Control name="title" defaultValue={title} required />
          </Form.Group>
          <Form.Group className="mt-2" controlId="content">
            <Form.Label>{t('content')}</Form.Label>
            <Form.Control name="content" defaultValue={content} required />
          </Form.Group>
          <Form.Group className="mt-2" controlId="type">
            <Form.Label>{t('type')}</Form.Label>
            <Form.Select name="type">
              {Object.entries(MessageTypeName()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" type="reset" disabled={loading}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {t('save')}
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    );
  }
}
