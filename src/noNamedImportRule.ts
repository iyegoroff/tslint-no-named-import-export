import * as Lint from 'tslint'
import * as ts from 'typescript'
import flatten from 'array-flatten'

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-named-import',
    description: 'Disallows named imports in ES6-style modules.',
    descriptionDetails: 'Use default import instead.',
    rationale: 'Can be used to mimic `module interface` with default import.',
    optionsDescription: 'A list of module names or regular expression patterns.',
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
      [true, '^view$'],
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

  public static FAILURE_STRING = 'Use of named imports is forbidden'
}

type Options = Array<string | string[]>

function walk(ctx: Lint.WalkContext<Options>): void {
  const { sourceFile } = ctx
  const { statements } = sourceFile
  const moduleChecks = flatten<string>(ctx.options).map(p => new RegExp(p))

  statements.forEach((statement, idx) => {
    if (statement.kind === ts.SyntaxKind.ImportDeclaration) {
      const {
        importClause = { namedBindings: undefined },
        moduleSpecifier
      } = statement as ts.ImportDeclaration

      if (
        importClause.namedBindings !== undefined && (
          moduleSpecifier.kind === ts.SyntaxKind.StringLiteral &&
          moduleChecks.some(p => p.test((moduleSpecifier as ts.StringLiteral).text))
        ) || (
          moduleSpecifier.kind === ts.SyntaxKind.BinaryExpression &&
          statements.length >= (idx + 3) &&
          statements[idx + 2].kind === ts.SyntaxKind.ExpressionStatement &&
          moduleChecks
            .some(p => p.test((statements[idx + 2] as ts.ExpressionStatement).expression.getText()))
        )
      ) {
        ctx.addFailureAtNode(statement.getChildAt(0, sourceFile), Rule.FAILURE_STRING)
      }
    }
  })
}
