import React, { ChangeEvent, PropsWithoutRef, PureComponent } from 'react';

import style from 'idea-react/source/FilePicker/index.module.less';
import { Icon } from 'idea-react';
import { uploadFile } from '../utils/uploadFile';

export type FilePickerProps = PropsWithoutRef<{
  accept: `${string}/${string}`;
  name: string;
  multiple?: boolean;
  required?: boolean;
  defaultValue?: string[];
  max?: number;
}>;

interface State {
  values: string[];
}

export class FileUpload extends PureComponent<FilePickerProps, State> {
  static displayName = 'FilePicker';

  state: Readonly<State> = {
    values: [],
  };

  componentDidMount() {
    const { defaultValue: values = [] } = this.props;

    this.setState({ values });
  }

  addOne = async ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files) return;

    const { values } = this.state;
    if (this.props.max && values.length >= this.props.max) {
      return;
    }

    for (let file of files) {
      const fileUrl: string = await uploadFile(file);
      console.log('uploaded');
      values.push(fileUrl);
    }

    this.setState({ values: [...values] });
  };

  deleteOne(index: number) {
    const { values } = this.state;
    const current = values[index];

    if (current.startsWith('blob:')) URL.revokeObjectURL(current);

    this.setState({
      values: [...values.slice(0, index), ...values.slice(index + 1)],
    });
  }

  render() {
    const { accept, name, multiple, required, max } = this.props,
      { values } = this.state;
    const isImage = accept.startsWith('image/');

    return (
      <ul className="list-unstyled m-0 form-control d-flex flex-wrap">
        {values.map((URI, index) => (
          <li
            key={`file-picker-${URI}`}
            className={`shadow-sm me-3 my-2 ${style.file}`}
          >
            <input type="hidden" name={name} value={URI} />

            {isImage ? <img src={URI} /> : URI.split('/').slice(-1)[0]}
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
}
