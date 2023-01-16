import { Option, Select } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';

import { i18n, LanguageName } from '../../models/Translation';
import { withTranslation } from '../../pages/api/core';

@observer
class LanguageMenu extends PureComponent {
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
