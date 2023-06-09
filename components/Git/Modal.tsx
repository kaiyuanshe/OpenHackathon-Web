import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Modal,
  ModalProps,
  Row,
} from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { GitTemplateModal } from '../../models/TemplateRepo';
import { i18n } from '../../models/Translation';

export interface GitModalProps extends Pick<ModalProps, 'show' | 'onHide'> {
  name?: string;
  onReload: () => void;
}

const { t } = i18n;
@observer
export class GitModal extends PureComponent<GitModalProps> {
  @observable
  inputField = { label: `${t('address')}`, text: `${t('url')}`, value: '' };

  @observable
  validated = false;

  gitTemplateStore = new GitTemplateModal(this.props.name!);

  @action
  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) return (this.validated = true);

    const data = formToJSON(form);

    await this.gitTemplateStore.updateOne(data);

    this.props.onHide!();
    this.props.onReload!();
  };

  render() {
    const { show, onHide } = this.props;

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
        >
          <Modal.Body>
            <FormGroup as={Row} className="mb-3">
              <Form.Label column sm={2}>
                {this.inputField.label}
              </Form.Label>
              <Col sm={10}>
                <InputGroup>
                  <InputGroup.Text>{this.inputField.text}</InputGroup.Text>
                  <Form.Control
                    name={this.inputField.text}
                    type="url"
                    value={this.inputField.value}
                    onChange={event =>
                      (this.inputField.value = event?.target.value)
                    }
                    required
                  />
                </InputGroup>
              </Col>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="reset" onClick={onHide}>
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
