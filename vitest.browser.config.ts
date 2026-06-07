import { playwright } from '@vitest/browser-playwright'
import { mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config.js'

export default mergeConfig(baseConfig, {
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        { browser: 'firefox' },
        { browser: 'webkit' },
        { browser: 'chromium' },
      ],
    },
  },
})
