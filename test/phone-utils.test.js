/**
 * phone-utils.test.js - Tests for phone normalization and validation
 * Run: node --test test/phone-utils.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { normalize, validate, deduplicate } = require('../server/lib/phone-utils');
// 2026-11-05 09:54 +03: sample numbers removed (they belong to real people), int-testnumber.
// normalize/validate tests read KWTSMS_TEST_NUMBER and build the formats at runtime; dedup uses the placeholder.
const tn = require('./helpers/test-number');

describe('normalize', () => {
  it('keeps valid international format digits only', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.plain), v.plain);
  });
  it('strips + prefix', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.plus), v.plain);
  });
  it('strips 00 prefix', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.intl00), v.plain);
  });
  it('strips spaces', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.spaced), v.plain);
  });
  it('strips dashes', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.dashed), v.plain);
  });
  it('strips parentheses and dots', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.parenDot), v.plain);
  });
  it('converts Arabic-Indic digits', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.arabic), v.plain);
  });
  it('converts Extended Arabic-Indic digits', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize(v.persian), v.plain);
  });
  it('handles leading zeros stripped', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(normalize('0' + v.local), v.local);
  });
  it('returns empty string for null/undefined', () => {
    assert.equal(normalize(null), '');
    assert.equal(normalize(undefined), '');
    assert.equal(normalize(''), '');
  });
});

describe('validate', () => {
  it('accepts valid Kuwait mobile (965 + 8 digits)', (t) => {
    // 2026-11-05 09:54 +03: needs valid Kuwait digits, reads KWTSMS_TEST_NUMBER, int-testnumber
    const n = tn.requireNumber(t); if (!n) return;
    const v = tn.variants(n);
    assert.equal(validate(v.plain), true);
  });
  it('accepts valid international number (7-15 digits)', () => {
    assert.equal(validate('971501234567'), true);
  });
  it('rejects too short', () => {
    assert.equal(validate('12345'), false);
  });
  it('rejects too long', () => {
    assert.equal(validate('1234567890123456'), false);
  });
  it('rejects empty', () => {
    assert.equal(validate(''), false);
  });
  it('rejects non-digits', () => {
    assert.equal(validate('abc123'), false);
  });
});

describe('deduplicate', () => {
  it('removes duplicate numbers', () => {
    assert.deepEqual(
      deduplicate([tn.PLACEHOLDER, '96512345678', tn.PLACEHOLDER]),
      [tn.PLACEHOLDER, '96512345678']
    );
  });
  it('returns empty array for empty input', () => {
    assert.deepEqual(deduplicate([]), []);
  });
});
