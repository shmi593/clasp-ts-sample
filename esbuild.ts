import esbuild from 'esbuild';
import { Project, type SourceFile } from 'ts-morph';
import ts from 'typescript';

const ENTRY_POINT = 'src/index.ts';
const TS_CONFIG_PATH = 'tsconfig.json';
const GLOBAL_NAME = '_entry';
const OUT_FILE_PATH = 'dist/index.js';

type Function = {
  getName(): string | undefined;
  isExported(): boolean;
};

const extractFunctions = (sourceFile: SourceFile): Function[] => {
  // e.g. function foo() {}
  const functions = sourceFile.getFunctions() || [];
  // e.g. const bar = function() {} or const baz = () => {}
  const variableDefinedFunctions =
    sourceFile
      .getVariableDeclarations()
      .filter(
        (variable) =>
          variable.getInitializerIfKind(ts.SyntaxKind.FunctionExpression) ||
          variable.getInitializerIfKind(ts.SyntaxKind.ArrowFunction),
      ) || [];
  return [...functions, ...variableDefinedFunctions];
};

const getExportedFunctionNames = (sourceFile: SourceFile): string[] =>
  extractFunctions(sourceFile)
    .filter((fn) => fn.isExported())
    .map((fn) => fn.getName())
    .filter((name): name is string => name !== undefined);

const generateGASCallableWrapper = (functionName: string) => `
function ${functionName} () {
  return ${GLOBAL_NAME}.${functionName}(...arguments);
}`;

const generateGASCallableFooter = () => {
  const project = new Project({ tsConfigFilePath: TS_CONFIG_PATH });
  const sourceFile = project.getSourceFileOrThrow(ENTRY_POINT);
  return getExportedFunctionNames(sourceFile)
    .map((name) => generateGASCallableWrapper(name))
    .join('\n');
};

esbuild
  .build({
    entryPoints: [ENTRY_POINT],
    outfile: OUT_FILE_PATH,
    bundle: true,
    format: 'iife',
    globalName: GLOBAL_NAME,
    footer: { js: generateGASCallableFooter() },
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

console.log('✅ Build completed successfully.');
