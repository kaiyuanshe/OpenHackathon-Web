import { Option, Select } from 'idea-react';
import { PureComponent } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { i18n, LanguageName } from '../../models/Translation';

class LanguageMenu extends PureComponent<WithTranslation> {
  render() {
    const { currentLanguage, t } = i18n;

    return (
      <Select
        value={currentLanguage}
        onChange={code => i18n.changeLanguage(code as typeof currentLanguage)}
      >
        {Object.entries(LanguageName).map(([code, name]) => (
          <Option key={code} value={code}>
            {name}
          </Option>
        ))}
      </Select>
    );
  }
}
export default withTranslation()(LanguageMenu);
