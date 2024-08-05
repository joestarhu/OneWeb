import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import { DMSETTINGS } from "src/base/dm";
import messages from 'src/i18n'
import i18n from 'src/i18n';

export default boot(({ app }) => {

  let user_locale = localStorage.getItem(DMSETTINGS.locale) || "zh-CN"

  const i18n = createI18n({
    locale: user_locale,
    globalInjection: true,
    messages
  })

  // Set i18n instance on app
  app.use(i18n)
})