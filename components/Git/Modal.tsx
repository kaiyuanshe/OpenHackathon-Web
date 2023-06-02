import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

import { i18n } from '../../models/Translation';

export interface GitModalProps extends Pick<ModalProps, 'show' | 'onHide'> {
  name?: string;
}

const { t } = i18n;

@observer
export class GitModal extends PureComponent<GitModalProps> {
  @observable
  inputFields = [{ label: '地址', text: '请输入GitHub地址', value: '' }];

  @observable
  validated = false;

  @action
  addField() {
    this.inputFields = [
      ...this.inputFields,
      { label: '地址', text: '请输入GitHub地址', value: '' },
    ];
  }

  @action
  deleteCurrentField = (i: number) => {
    const currentInputFields = this.inputFields.filter(
      inputField => inputField !== this.inputFields[i],
    );
    this.inputFields = currentInputFields;
  };

  @action
  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) return (this.validated = true);
    const data = Object.values(formToJSON(form));
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
            {this.inputFields.map((inputField, index) => (
              <FormGroup as={Row} className="mb-3" key={index}>
                <Form.Label column sm={2}>
                  {inputField.label}
                </Form.Label>
                <Col sm={10}>
                  <InputGroup>
                    <InputGroup.Text>{inputField.text}</InputGroup.Text>
                    <Form.Control
                      name={`${inputField.label}${index}`}
                      type="url"
                      value={inputField.value}
                      onChange={event =>
                        (inputField.value = event?.target.value)
                      }
                      required
                    />
                    <Button
                      variant="danger"
                      type="submit"
                      onClick={() => this.deleteCurrentField(index)}
                    >
                      <FontAwesomeIcon className="me-2" icon={faTrash} />
                    </Button>
                  </InputGroup>
                </Col>
              </FormGroup>
            ))}
            <Button
              variant="success"
              className="my-3"
              onClick={() => this.addField()}
            >
              <FontAwesomeIcon className="me-2" icon={faPlus} />
              {t('add')}
            </Button>
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
