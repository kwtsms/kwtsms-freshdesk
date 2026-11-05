/**
 * FILE:      test/helpers/test-number.js
 * CREATED:   2026-11-05 09:44 +03
 * TASK:      int-testnumber
 * AUTHOR:    M Alhassoun
 * WHAT:      The one shared source of the Kuwait test phone number for every test file.
 *            Reads KWTSMS_TEST_NUMBER (digits only, 965 + 8 digits) and builds the
 *            format variants (+, 00, spaces, dashes, Arabic-Indic, Persian) at runtime.
 * WHY:       Hard-coded sample numbers belong to real people. Tests that need valid
 *            Kuwait digits read them from the environment and skip when it is unset
 *            or malformed. Tests that only pass a number to mocks use PLACEHOLDER.
 * USAGE:     const tn = require('./helpers/test-number');
 *            node:test: it('x', (t) => { const n = tn.requireNumber(t); if (!n) return; ... });
 *            mocha:     it('x', function() { const n = tn.requireNumber(this); ... });
 *            mocha this.skip() throws, node:test t.skip() returns, hence the `if (!n) return`.
 * DEPENDS:   nothing (stdlib only); env KWTSMS_TEST_NUMBER for the tests that need it.
 *            fdk test loads every .js under test/ into mocha; this file defines no tests.
 */
'use strict';

// Placeholder for numbers that are only passed to mocks and never validated.
const PLACEHOLDER = '965XXXXXXXX';
// 2026-11-05 09:48 +03: valid-format number nobody can hold, int-testnumber. Country code 999
// is unassigned in E.164, so server.js validate() accepts it (no PHONE_RULES entry) and mocked
// post-validation tests (send errors, stats, logs) run and count for coverage without the env var.
// Tests that need Kuwait digits (prefix, local zero, 965 formats) use requireNumber() instead.
const UNASSIGNED_CC = '99912345678';
const SKIP_REASON ='KWTSMS_TEST_NUMBER is unset or not 965 + 8 digits';

/** The env test number, or null when unset or malformed. Never logged. */
function getNumber() {
  const raw = process.env.KWTSMS_TEST_NUMBER;
  return raw && /^965\d{8}$/.test(raw) ? raw : null;
}

/** Return the number, or skip the current test (mocha `this` or node:test `t`). */
function requireNumber(ctx) {
  const n = getNumber();
  if (!n) ctx.skip(SKIP_REASON);
  return n;
}

/** Format variants of a 965 + 8 digit number, built at runtime. */
function variants(n) {
  const local = n.slice(3);
  const a = local.slice(0, 4);
  const b = local.slice(4);
  const toDigits = (s, zero) => s.replace(/\d/g, (d) => String.fromCharCode(zero + Number(d)));
  return {
    plain: n,
    local: local,
    plus: '+' + n,
    intl00: '00' + n,
    spaced: '965 ' + a + ' ' + b,
    plusSpaced: '+965 ' + a + ' ' + b,
    dashed: '965-' + a + '-' + b,
    plusDashed: '+965-' + a + '-' + b,
    parenDot: '(965) ' + a + '.' + b,
    localZero: '9650' + local,
    arabic: toDigits(n, 0x0660),
    persian: toDigits(n, 0x06F0)
  };
}

/**
 * A second distinct valid Kuwait number for multi-recipient tests that run
 * against mocks only: the test number with its last digit changed. Never sent.
 */
function otherNumber(n) {
  return n.slice(0, -1) + String((Number(n.slice(-1)) + 1) % 10);
}

module.exports = { PLACEHOLDER, UNASSIGNED_CC, SKIP_REASON, getNumber, requireNumber, variants, otherNumber };
