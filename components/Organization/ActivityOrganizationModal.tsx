import { observer } from 'mobx-react';
import { PureComponent, FormEvent, createRef } from 'react';
import { Form, Button, ModalProps, Modal } from 'react-bootstrap';
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

  increaseId = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store, onSave } = this.props;

    const { name, description, type, logoURI } =
      formToJSON<
        Pick<OrganizationForm, 'name' | 'description' | 'type' | 'logoURI'>
      >(event.currentTarget);

    await store.updateOne({
      name,
      description,
      type,
      logo: {
        name,
        description,
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
        <Modal.Body as="form"
            ref={this.form}
            onSubmit={this.increaseId}
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
                {Object.entries(OrganizationTypeName).map(
                  ([key, value], idx) => {
                    return (
                      <option key={idx + key} value={key}>
                        {value}
                      </option>
                    );
                  },
                )}
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
            {/* 名称和描述默认为组织名称 */}
            {/*<Form.Group className="mt-2">*/}
            {/*  <Form.Label htmlFor="LogoName">Logo 名称</Form.Label>*/}
            {/*  <Form.Control id="LogoName" type="text" placeholder="请输入 Logo 名称" />*/}
            {/*</Form.Group>*/}
            {/*<Form.Group className="mt-2">*/}
            {/*  <Form.Label htmlFor="Description">Logo 描述</Form.Label>*/}
            {/*  <Form.Control id="Description" type="text" placeholder="请输入 Logo 描述" />*/}
            {/*</Form.Group>*/}

            {/* 后端未添加该属性 https://hackathon-api.kaiyuanshe.cn/swagger/index.html#operations-OpenHackathon-put_v2_hackathon__hackathonName__organizer */}
            {/*<Form.Group className="mt-2">*/}
            {/*  <Form.Label htmlFor="URL">URL</Form.Label>*/}
            {/*  <Form.Control id="URL" type="text" placeholder="请输入 URL" />*/}
            {/*</Form.Group>*/}

            <Modal.Footer>
              <Button variant="secondary" type="reset">
                取消
              </Button>
              <Button variant="primary" type="submit" id="increase">
                保存
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
