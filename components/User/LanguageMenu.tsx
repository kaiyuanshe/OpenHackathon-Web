import { Option, Select } from 'idea-react';
import { observer } from 'mobx-react';
import { useContext } from 'react';

import { I18nContext, LanguageName } from '../../models/Base/Translation';

const LanguageMenu = observer(() => {
  const i18n = useContext(I18nContext);

  return (
    <Select
      value={i18n.currentLanguage}
      onChange={code => i18n.loadLanguages(code as typeof i18n.currentLanguage)}
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
