import { IReplaceOptions } from '../contracts';
import { splitContent, findEscapeSequence } from './line-ending.helper';

export function addContent(inputString: string, content: string | string[], options: IReplaceOptions): string {
    content = Array.isArray(content) ? content : [content];

    const lineBreak = findEscapeSequence(inputString);
    const lines = splitContent(inputString);
    const replaceBelowLine: string | undefined = lines.filter((line) => line.indexOf(options.replaceBelow) === 0)[0];
    const replaceBelowIndex = replaceBelowLine != null ? lines.indexOf(replaceBelowLine) : -1;
    const replaceAboveLine: string | undefined = lines.filter((line) => line.indexOf(options.replaceAbove) === 0)[0];
    const replaceAboveIndex = replaceAboveLine != null ? lines.indexOf(replaceAboveLine) : -1;

    if (replaceAboveIndex > -1 && replaceBelowIndex > -1 && replaceAboveIndex < replaceBelowIndex) {
        throw new Error(
            `The replaceAbove marker '${options.replaceAbove}' was found before the replaceBelow marker '${options.replaceBelow}'. The replaceBelow marked must be before the replaceAbove.`,
        );
    }

    const linesBefore = lines.slice(0, replaceBelowIndex + 1);
    const linesAfter = replaceAboveIndex >= 0 ? lines.slice(replaceAboveIndex) : [];

    const constantLines = content.reduce(
        (lines, currentContent) => [...lines, ...splitContent(currentContent)],
        new Array<string>(),
    );

    return [...linesBefore, ...constantLines, ...linesAfter].join(lineBreak);
}
