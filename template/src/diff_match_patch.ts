import _DiffMatchPatch from 'diff-match-patch';

type DiffTuple = [number, string];

/**
 * Extend the `_DiffMatchPatch` package
 * @class
 */
class DiffMatchPatch extends _DiffMatchPatch {
    private testMode: boolean;

    constructor(testMode?: boolean) {
        super();
        this.testMode = testMode || false;
    }

    /**
     * Compute the diffs between two texts after stripping HTML content.
     * @param text1 - The first input text.
     * @param text2 - The second input text.
     * @param optCheckLines - Optional parameter to determine if
     *     line-level comparison should be used.
     * @param optDeadline - Optional parameter to specify the
     *     deadline for the operation in milliseconds.
     * @returns The list of differences between the two texts.
     * @memberof DiffMatchPatch
     */
    diffMain(text1: string, text2: string, optCheckLines?: boolean, optDeadline?: number): DiffTuple[] {
        return super.diff_main(this._stripHtml(text1), this._stripHtml(text2), optCheckLines, optDeadline);
    }

    /**
     * Compute the diffs between two texts in line mode.
     *
     * First convert the texts into compact string representations
     * based on unique lines, then compute the diffs, then reconstruct
     * the diffs in terms of the original lines.
     * @param text1 - The first text to compare.
     * @param text2 - The second text to compare.
     * @returns An array of "tuple-like" diffs, where each "tuple"
     *     contains a flag and corresponding text.
     * @memberof DiffMatchPatch
     */
    diffLineMode(text1: string, text2: string): DiffTuple[] {
        const a = this.diff_linesToChars_(text1, text2);
        const lineText1 = a.chars1;
        const lineText2 = a.chars2;
        const lineArray = a.lineArray;
        const diffs = super.diff_main(lineText1, lineText2, false);
        this.diff_charsToLines_(diffs, lineArray);
        return diffs;
    }

    /**
     * Convert a list of diff operations into a formatted HTML string with
     * appropriate markup for insertions, deletions, and equalities.
     * @param diffs - Array of diffs where each diff consists of an
     *     operation type (insert, delete, or equal) and the associated text.
     * @returns HTML string representing the diff operations
     * @memberof DiffMatchPatch
     */
    diffPrettyHtml(diffs: DiffTuple[]): string {
        const html: string[] = [];
        const patternAmp = /&/g;
        const patternLt = /</g;
        const patternGt = />/g;
        const patternPara = /\n/g;
        for (let x = 0; x < diffs.length; x++) {
            const op = diffs[x][0]; // Operation (insert, delete, equal)
            const data = diffs[x][1]; // Text of change.
            const text = data.replace(patternAmp, '&amp;').replace(patternLt, '&lt;').replace(patternGt, '&gt;').replace(patternPara, '&para;<br>');
            switch (op) {
                case _DiffMatchPatch.DIFF_INSERT:
                    html[x] = '<ins>' + text + '</ins>';
                    break;
                case _DiffMatchPatch.DIFF_DELETE:
                    html[x] = '<del>' + text + '</del>';
                    break;
                case _DiffMatchPatch.DIFF_EQUAL:
                    html[x] = '<span>' + text + '</span>';
                    break;
            }
        }
        return html.join('');
    }

    /**
     * Format the given list of diffs into a human-readable string
     * with indicators for inserted, deleted, and unchanged text.
     * @param diffs - Array of arrays where each sub-array contains
     *     two elements:
     *     - the operation type (numeric indicator)
     *     - and the text associated with the operation
     *
     *     The operation types are typically defined as constants: DIFF_INSERT,
     *     DIFF_DELETE, or DIFF_EQUAL.
     * @returns Formatted string where
     *     - inserted text is prefixed with '+ '
     *     - deleted text is prefixed with '- '
     *     - and unchanged text is prefixed with '  '
     * @memberof DiffMatchPatch
     */
    diffPrettyCode(diffs: DiffTuple[]): string {
        const html: string[] = [];
        const patternPara = /\n/g;
        for (let x = 0; x < diffs.length; x++) {
            const op = diffs[x][0]; // Operation (insert, delete, equal)
            const text = diffs[x][1]; // Text of change.
            const lb = text.match(patternPara) ? '' : '\n';
            switch (op) {
                case _DiffMatchPatch.DIFF_INSERT:
                    html[x] = text.replace(/^(.)/gm, '+ $1') + lb;
                    break;
                case _DiffMatchPatch.DIFF_DELETE:
                    html[x] = text.replace(/^(.)/gm, '- $1') + lb;
                    break;
                case _DiffMatchPatch.DIFF_EQUAL:
                    html[x] = text.replace(/^(.)/gm, '  $1');
                    break;
            }
        }
        return html.join('');
    }

    /**
     * Refine diff list reduce diff complexity, improve readability.
     * @param diffs - Array representing the differences, where each element
     *     is "tuple-like" containing a diff operation and text segment.
     * @returns List of diffs with adjusted semantic changes.
     * @memberof DiffMatchPatch
     */
    diffCleanupSemantic(diffs: DiffTuple[]): void {
        this.diff_cleanupSemantic(diffs);
    }

    /**
     * Remove all HTML tags from a given string, return only text.
     * @param html - HTML string to be stripped of tags.
     * @returns Plain text content after removing HTML tags.
     * @memberof DiffMatchPatch
     */
    private _stripHtml(html: string): string {
        // no document object with CLI when running tests
        if (this.testMode) {
            return html;
        }
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
}

export { DiffMatchPatch, DiffMatchPatch as default };
