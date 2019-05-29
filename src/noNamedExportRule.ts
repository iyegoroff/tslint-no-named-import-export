import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-named-export',
    description: 'Disallows named exports in ES6-style modules.',
    descriptionDetails: 'Use default export instead.',
    rationale: 'Can be used to mimic `module interface` with default export.',
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'maintainability',
    typescriptOnly: false
  }

  public static FAILURE_STRING = 'Use of named exports is forbidden'

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk)
  }
}

function walk(ctx: Lint.WalkContext): void {
  const syntaxList = (ctx.sourceFile.getChildren() || [])
    .find(node => node.kind === ts.SyntaxKind.SyntaxList)

  if (syntaxList !== undefined) {
    (syntaxList.getChildren() || []).forEach((node) => {
      if (node.kind === ts.SyntaxKind.ExportKeyword) {
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING)
      }
    })
  }

  ctx.sourceFile.statements.forEach((statement) => {
    const { modifiers = [] } = statement

    if (statement.kind === ts.SyntaxKind.ExportDeclaration) {
      const { exportClause = { elements: [] } } = statement as ts.ExportDeclaration

      if (!(
        exportClause.elements.length === 1 &&
        exportClause.elements[0].name.escapedText === 'default'
      )) {
        ctx.addFailureAtNode(statement.getChildAt(0, ctx.sourceFile), Rule.FAILURE_STRING)
      }

    } else if (
      modifiers.length >= 1 &&
      modifiers[0].kind === ts.SyntaxKind.ExportKeyword &&
      (modifiers.length < 2 || modifiers[1].kind !== ts.SyntaxKind.DefaultKeyword)
    ) {
      ctx.addFailureAtNode(statement.getChildAt(0, ctx.sourceFile), Rule.FAILURE_STRING)
    }
  })
}
