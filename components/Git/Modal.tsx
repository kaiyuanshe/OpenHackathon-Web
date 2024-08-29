import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, FormEvent } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Modal,
  ModalProps,
  Row,
} from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { i18n } from '../../models/Base/Translation';
import { GitModel } from '../../models/Git';

export interface GitModalProps extends Pick<ModalProps, 'show' | 'onHide'> {
  name?: string;
  store: GitModel;
  onSave?: () => any;
}

const { t } = i18n;

@observer
export class GitModal extends Component<GitModalProps> {
  @observable
  accessor value = '';

  @observable
  accessor validated = false;

  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (!form.checkValidity()) return (this.validated = true);

    const { store, onSave } = this.props;
    await store.updateOne(formToJSON(form));
    onSave?.();

    this.value = '';
  };

  cancelHandler = () => {
    this.value = '';
    this.props.onHide?.();
  };

  render() {
    const { show, onHide } = this.props;
    const { value } = this;

    return (
      <Modal size="lg" {...{ show, onHide }}>
        <Modal.Header closeButton>
          <Modal.Title>{t('add_template_repository')}</Modal.Title>
        </Modal.Header>
        <Form
          noValidate
          className="container-fluid"
          validated={this.validated}
          onSubmit={this.submitHandler}
          onReset={this.cancelHandler}
        >
          <Modal.Body>
            <FormGroup as={Row} className="mb-3">
              <Form.Label column sm={2}>
                {t('address')}
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="url"
                  name="html_url"
                  value={value}
                  required
                  placeholder={t(
                    'for_example',
                    'https://github.com/idea2app/React-MobX-Bootstrap-ts',
                  )}
                  onChange={({ currentTarget: { value } }) =>
                    (this.value = value)
                  }
                />
              </Col>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="reset">
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('submit')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
