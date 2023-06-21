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
  store: GitTemplateModal;
  onSave?: () => any;
}

const { t } = i18n;

@observer
export class GitModal extends PureComponent<GitModalProps> {
  @observable
  inputField = { label: t('address'), text: t('url'), value: '' };

  @observable
  validated = false;

  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (!form.checkValidity()) return (this.validated = true);

    const { store, onSave } = this.props;
    await store.updateOne(formToJSON(form));
    onSave?.();

    this.inputField.value = '';
  };

  cancelHandler = () => {
    this.inputField.value = '';
    this.props.onHide?.();
  };

  render() {
    const { show, onHide } = this.props;
    const { label, text, value } = this.inputField;

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
                {label}
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="url"
                  name={text}
                  value={value}
                  placeholder={
                    t('for_example') +
                    ' https://github.com/idea2app/React-MobX-Bootstrap-ts'
                  }
                  onChange={({ currentTarget: { value } }) =>
                    (this.inputField.value = value)
                  }
                  required
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
