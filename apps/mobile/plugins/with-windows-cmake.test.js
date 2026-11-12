const { expect, test } = require('@jest/globals');

const { addWindowsCmake } = require('./with-windows-cmake');

const gradle =
  'allprojects {}\n\napply plugin: "expo-root-project"\napply plugin: "com.facebook.react.rootproject"\n';

test('inserta la regla antes de los plugins raíz (si va después, Gradle la aplica tarde)', () => {
  const out = addWindowsCmake(gradle);
  expect(out.indexOf('cmake.version = "3.31.6"')).toBeGreaterThan(-1);
  expect(out.indexOf('cmake.version')).toBeLessThan(
    out.indexOf('apply plugin: "expo-root-project"'),
  );
});

test('solo actúa en Windows', () => {
  expect(addWindowsCmake(gradle)).toContain("os.name').toLowerCase().contains('windows')");
});

test('no la duplica si ya está', () => {
  const once = addWindowsCmake(gradle);
  expect(addWindowsCmake(once)).toBe(once);
});
