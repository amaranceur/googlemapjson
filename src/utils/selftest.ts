import { normalizePhone } from './phone'
import { parseRestaurants } from './parse'
import { fillTemplate, whatsappUrl } from './whatsapp'
import { toCsv } from './csv'
import assert from 'node:assert'
const cases: [unknown, string | null][] = [
  ['0555123456', '+213555123456'], ['0666123456', '+213666123456'], ['0777123456', '+213777123456'],
  ['0555 12 34 56', '+213555123456'], ['+213555123456', '+213555123456'], ['+213 (0) 555-12-34-56', '+213555123456'],
  ['00213555123456', '+213555123456'], ['555123456', '+213555123456'], ['021 12 34 56', '+21321123456'],
  ['0555123456 / 0777000111', '+213555123456'], ['+33612345678', '+33612345678'],
  ['abc', null], ['', null], [null, null], [undefined, null], [12345, null], ['0155123456', null], [{}, null], [['0555123456'], '+213555123456']
]
for (const [i, e] of cases) assert.strictEqual(normalizePhone(i).phone, e, JSON.stringify(i))
const good = JSON.stringify({ data: { restaurants: [
  { restaurant_name: 'Pizzeria El Bahdja', telephone: '0555 12 34 56', wilaya: 'Alger', commune: 'Bab Ezzouar' },
  { name: 'Chez Karim', phone: '0555123456', city: 'Chlef' }, null, 'oops', 42,
  { name: 'Sans numéro' }, { name: 'Bad', mobile: { x: 1 }, wilaya: ['Oran'] }, {}
] } })
const r = parseRestaurants(good)
assert.strictEqual(r.restaurants.length, 5); assert.strictEqual(r.skipped, 3)
assert.strictEqual(r.restaurants[0].phone, '+213555123456')
assert.throws(() => parseRestaurants('{bad json'), /not valid JSON/)
assert.throws(() => parseRestaurants('[]'), /No restaurant/)
assert.throws(() => parseRestaurants('"hi"'), /No restaurant/)
assert.strictEqual(fillTemplate('Bonjour {{name}} ({{wilaya}})', r.restaurants[0]), 'Bonjour Pizzeria El Bahdja (Alger)')
assert.ok(whatsappUrl('+213555123456', 'é ?').startsWith('https://wa.me/213555123456?text=%C3%A9%20%3F'))
assert.ok(toCsv(r.restaurants, {}).includes('"'.length ? 'Restaurant Name' : ''))
console.log('All self-tests passed')
