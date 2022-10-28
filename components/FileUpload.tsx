import { Icon, Loading } from 'idea-react';
import style from 'idea-react/source/FilePicker/index.module.less';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ChangeEvent, PropsWithoutRef, PureComponent } from 'react';
import { Image } from 'react-bootstrap';

import sessionStore from '../models/Session';

export type FilePickerProps = PropsWithoutRef<{
  accept: `${string}/${string}`;
  name: string;
  multiple?: boolean;
  required?: boolean;
  defaultValue?: string[];
  max?: number;
}>;

@observer
export class FileUpload extends PureComponent<FilePickerProps> {
  @observable
  values = this.props.defaultValue || [];

  addOne = async ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files) return;

    const { max } = this.props,
      { values } = this;

    if (max && values.length >= max) return;

    for (let file of files) {
      const fileUrl = await sessionStore.uploadFile(file);

      values.push(fileUrl);
    }
    this.values = [...values];
  };

  deleteOne(index: number) {
    const { values } = this;
    const current = values[index];

    if (current.startsWith('blob:')) URL.revokeObjectURL(current);

    this.values = [...values.slice(0, index), ...values.slice(index + 1)];
  }

  renderList() {
    const { accept, name, multiple, required, max } = this.props,
      { values } = this;
    const isImage = accept.startsWith('image/');

    return (
      <ul className="list-unstyled m-0 form-control d-flex flex-wrap">
        {values.map((URI, index) => (
          <li
            key={`file-picker-${URI}`}
            className={`shadow-sm me-3 my-2 ${style.file}`}
          >
            <input type="hidden" name={name} value={URI} />

            {isImage ? (
              <Image src={URI} alt={name} />
            ) : (
              URI.split('/').slice(-1)[0]
            )}
            <Icon
              className={style.close}
              name="x"
              onClick={() => this.deleteOne(index)}
            />
          </li>
        ))}
        {(!values.length ||
          (max && multiple && values.length < max) ||
          (!max && multiple)) && (
          <li className={`shadow-sm me-3 my-2 ${style.file} ${style.empty}`}>
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              required={multiple ? !values.length && required : required}
              onChange={this.addOne}
            />
          </li>
        )}
      </ul>
    );
  }

  render() {
    const { uploading } = sessionStore;

    return (
      <>
        {uploading > 0 && <Loading />}

        {this.renderList()}
      </>
    );
  }
}
