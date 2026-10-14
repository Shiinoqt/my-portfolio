import assert from 'node:assert/strict'
import { test } from 'node:test'
import { copy, socialLinks } from '../src/content.js'

function keys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) =>
    typeof item === 'object' ? keys(item, `${prefix}${key}.`) : `${prefix}${key}`,
  ).sort()
}

test('Italian and English cover the same desktop content', () => {
  assert.deepEqual(keys(copy.it), keys(copy.en))
  for (const language of Object.values(copy)) {
    for (const app of ['welcome', 'about', 'contact', 'settings', ...Object.keys(socialLinks)]) {
      assert.ok(language.apps[app])
    }
  }
})

test('social links point to the supplied public profiles', () => {
  assert.equal(new URL(socialLinks.github).pathname, '/Shiinoqt')
  assert.equal(new URL(socialLinks.linkedin).hostname, 'www.linkedin.com')
  assert.equal(new URL(socialLinks.instagram).pathname, '/damienrebs/')
  for (const link of Object.values(socialLinks)) assert.equal(new URL(link).protocol, 'https:')
})
