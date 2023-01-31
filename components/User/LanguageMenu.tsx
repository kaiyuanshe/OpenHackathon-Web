import { Option, Select } from 'idea-react';
import { observer } from 'mobx-react';

import { i18n, LanguageName } from '../../models/Translation';

const LanguageMenu = observer(() => {
  const { currentLanguage } = i18n;

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
});
export default LanguageMenu;
