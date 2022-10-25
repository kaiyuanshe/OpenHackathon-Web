import { t } from 'i18next';
import { observer } from 'mobx-react';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import {
  Organization,
  OrganizationModel,
  OrganizationTypeName,
} from '../../models/Organization';

export interface OrganizationModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: OrganizationModel;
  onSave?: () => any;
}

interface OrganizationForm extends Organization {
  logoURI: string;
}

@observer
export class OrganizationModal extends PureComponent<OrganizationModalProps> {
  private form = createRef<HTMLFormElement>();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store, onSave } = this.props;

    const { name, description, type, logoURI } = formToJSON<
      Pick<OrganizationForm, 'name' | 'description' | 'type' | 'logoURI'>
    >(event.currentTarget);

    await store.updateOne({
      name,
      description,
      type,
      logo: {
        name,
        description: description!,
        uri: logoURI,
      },
    });
    onSave?.();
    this.handleReset();
  };

  handleReset = () => {
    this.form.current?.reset();
    this.props.onHide?.();
  };

  render() {
    const { show, onHide } = this.props;

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>增加主办方信息</Modal.Title>
        </Modal.Header>
        <Modal.Body
          as="form"
          ref={this.form}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
        >
          <Form.Group className="mt-2">
            <Form.Label htmlFor="name">名称</Form.Label>
            <Form.Control
              id="name"
              name="name"
              type="text"
              placeholder="请输入名称"
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="description">描述</Form.Label>
            <Form.Control
              id="description"
              name="description"
              type="text"
              placeholder="请输入描述"
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
              {Object.entries(OrganizationTypeName).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label htmlFor="logo-uri">Logo URI</Form.Label>
            <Form.Control
              id="logo-uri"
              name="logoURI"
              type="text"
              placeholder="请输入 Logo URI"
              required
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" type="reset">
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('save')}
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    );
  }
}
