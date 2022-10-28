import { observer } from 'mobx-react';
import { NewData } from 'mobx-restful';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { Message, MessageModel, MessageTypeName } from '../../models/Message';

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
          <Modal.Title>发布公告</Modal.Title>
        </Modal.Header>
        <Modal.Body
          as="form"
          ref={this.form}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
        >
          <Form.Group className="mt-2">
            <Form.Label htmlFor="content">公告内容</Form.Label>
            <Form.Control
              id="content"
              name="content"
              type="text"
              placeholder="公告内容"
              defaultValue={content}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="title">链接地址</Form.Label>
            <Form.Control
              id="title"
              name="title"
              type="text"
              placeholder="链接地址"
              defaultValue={title}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="type">类型</Form.Label>
            <Form.Select
              id="type"
              name="type"
              aria-label="Default select example"
            >
              {Object.entries(MessageTypeName).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" type="reset" disabled={loading}>
              取消
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              保存
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    );
  }
}