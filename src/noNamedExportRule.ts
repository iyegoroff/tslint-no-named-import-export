import * as Lint from 'tslint'
import * as ts from 'typescript'
import flatten from 'array-flatten'
import { basename } from 'path'

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-named-export',
    description: 'Disallows named exports in ES6-style modules.',
    descriptionDetails: 'Use default export instead.',
    rationale: 'Can be used to mimic `module interface` with default export.',
    optionsDescription: 'A list of file names or regular expression patterns.',
    options: {
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'string',
            minLength: 1
          },
          {
            type: 'array',
            items: {
              type: 'string'
            },
            minLength: 1
          }
        ]
      }
    },
    optionExamples: [
      [true, '^view\\.(native|web|ios|android)\\.tsx$'],
      [true, 'state', ['^view\\w+', '^app']]
    ],
    type: 'maintainability',
    typescriptOnly: false
  }

  public isEnabled(): boolean {
    return super.isEnabled() && this.ruleArguments.length > 0
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk, this.ruleArguments)
  }

  public static FAILURE_STRING = 'Use of named exports is forbidden'
}

type Options = Array<string | string[]>

function walk(ctx: Lint.WalkContext<Options>): void {
  const { sourceFile } = ctx

  if (ctx.sourceFile.isDeclarationFile || !ts.isExternalModule(ctx.sourceFile)) {
    return
  }

  if (
    flatten<string>(ctx.options).some(p => new RegExp(p).test(basename(sourceFile.fileName)))
  ) {
    const syntaxList = (sourceFile.getChildren() || [])
      .find(node => node.kind === ts.SyntaxKind.SyntaxList)

    if (syntaxList !== undefined) {
      (syntaxList.getChildren() || []).forEach((node) => {
        if (node.kind === ts.SyntaxKind.ExportKeyword) {
          ctx.addFailureAtNode(node, Rule.FAILURE_STRING)
        }
      })
    }

    sourceFile.statements.forEach((statement) => {
      const { modifiers = [] } = statement

      if (statement.kind === ts.SyntaxKind.ExportDeclaration) {
        const { exportClause = { elements: [] } } = statement as ts.ExportDeclaration

        if (!(
          exportClause.elements.length === 1 &&
          exportClause.elements[0].name.escapedText === 'default'
        )) {
          ctx.addFailureAtNode(statement.getChildAt(0, sourceFile), Rule.FAILURE_STRING)
        }

      } else if (
        modifiers.length >= 1 &&
        modifiers[0].kind === ts.SyntaxKind.ExportKeyword &&
        (modifiers.length < 2 || modifiers[1].kind !== ts.SyntaxKind.DefaultKeyword)
      ) {
        ctx.addFailureAtNode(statement.getChildAt(0, sourceFile), Rule.FAILURE_STRING)
      }
    })
  }
}
