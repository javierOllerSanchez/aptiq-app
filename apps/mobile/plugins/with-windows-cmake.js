// Compilación nativa de Android en Windows: CMake anida la ruta completa del proyecto en sus carpetas de
// objetos y supera los 260 caracteres. Se usa el ninja de CMake 3.31 (admite rutas largas; el de 3.22 no)
// y una carpeta temporal corta. Solo en Windows: en CI y EAS (Linux) no cambia nada.
const { withProjectBuildGradle } = require('expo/config-plugins');

const MARK = 'cmake.version = "3.31.6"';
const BLOCK = `// Windows: CMake 3.31 (ninja con rutas largas) y carpeta temporal corta. Plugin with-windows-cmake.
if (System.getProperty('os.name').toLowerCase().contains('windows')) {
  subprojects { p ->
    ['com.android.library', 'com.android.application'].each { id ->
      p.plugins.withId(id) {
        p.android.externalNativeBuild.cmake.buildStagingDirectory = new File("C:/b/\${p.name}")
        p.android.externalNativeBuild.${MARK}
      }
    }
  }
}

`;

/** Inserta la regla antes de los plugins raíz: el de React Native evalúa los módulos al aplicarse. */
function addWindowsCmake(contents) {
  if (contents.includes(MARK)) return contents;
  return contents.replace(
    'apply plugin: "expo-root-project"',
    BLOCK + 'apply plugin: "expo-root-project"',
  );
}

module.exports = (config) =>
  withProjectBuildGradle(config, (c) => {
    c.modResults.contents = addWindowsCmake(c.modResults.contents);
    return c;
  });
module.exports.addWindowsCmake = addWindowsCmake;
