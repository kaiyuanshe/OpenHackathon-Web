import { Organizer } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { Component, createRef, FormEvent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import {
  OrganizerModel,
  OrganizerTypeName,
} from '../../models/Activity/Organization';
import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

export interface OrganizationModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: OrganizerModel;
  onSave?: () => any;
}

interface OrganizerForm extends Organizer {
  logoURI: string;
}

@observer
export class OrganizationModal extends Component<OrganizationModalProps> {
  private form = createRef<HTMLFormElement>();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store, onSave } = this.props;

    const { name, description, type, logoURI, url } = formToJSON<
      Pick<OrganizerForm, 'name' | 'description' | 'type' | 'logoURI' | 'url'>
    >(event.currentTarget);

    await store.updateOne({
      name,
      description,
      type,
      // @ts-ignore
      logo: { name, description, uri: logoURI },
      url: url,
    });
    onSave?.();
    this.handleReset();
  };

  handleReset = () => {
    this.form.current?.reset();
    this.props.onHide?.();
  };

  render() {
    const { show, onHide, store } = this.props;
    const loading = store.uploading > 0;

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('add_sponsor_information')}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          as="form"
          ref={this.form}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
        >
          <Form.Group className="mt-2" controlId="name">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              name="name"
              placeholder={t('please_enter_name')}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              name="description"
              placeholder={t('please_enter_description')}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2" controlId="type">
            <Form.Label>{t('type')}</Form.Label>
            <Form.Select name="type">
              {Object.entries(OrganizerTypeName).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2" controlId="logo-uri">
            <Form.Label>{t('logo_URL')}</Form.Label>
            <Form.Control
              type="url"
              name="logoURI"
              placeholder={t('please_enter_logo_url')}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2" controlId="url">
            <Form.Label>{t('url')}</Form.Label>
            <Form.Control
              type="url"
              name="url"
              placeholder={t('please_enter_url')}
              required
            />
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
