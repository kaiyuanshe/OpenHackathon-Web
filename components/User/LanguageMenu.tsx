import { PureComponent } from 'react';
import { Dropdown } from 'react-bootstrap';
import { WithTranslation, withTranslation } from 'react-i18next';

class LanguageMenu extends PureComponent<WithTranslation> {
  changeLanguage = (language: string) => () =>
    this.props.i18n.changeLanguage((localStorage.language = language));

  render() {
    const { i18n, t } = this.props;

    return (
      <Dropdown className="ms-md-3 my-2 my-md-0">
        <Dropdown.Toggle>
          {t('language')}: {t(i18n.language)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={this.changeLanguage('en-US')}>
            English
          </Dropdown.Item>
          <Dropdown.Item onClick={this.changeLanguage('zh-Hans')}>
            简体中文
          </Dropdown.Item>
          <Dropdown.Item onClick={this.changeLanguage('zh-Hant-TW')}>
            中文繁體-臺灣
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
export default withTranslation()(LanguageMenu);
