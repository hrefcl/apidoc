/**
 * Key Obfuscation Utility
 *
 * Obfuscates encryption keys by splitting them into multiple segments
 * and distributing them across different variables with random names.
 * Makes it extremely difficult to find the key in minified code.
 */

import crypto from 'crypto';

/**
 * Generate a random variable name
 */
function generateRandomVarName(): string {
    const prefixes = ['_', '__', '$$', '_$', '$_'];
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let name = prefix;
    const length = 8 + Math.floor(Math.random() * 8); // 8-16 chars
    for (let i = 0; i < length; i++) {
        name += chars[Math.floor(Math.random() * chars.length)];
    }
    return name;
}

/**
 * Generate decoy data to mix with real segments
 */
function generateDecoys(count: number): string[] {
    const decoys: string[] = [];
    for (let i = 0; i < count; i++) {
        const decoyLength = 10 + Math.floor(Math.random() * 30);
        decoys.push(crypto.randomBytes(decoyLength).toString('base64'));
    }
    return decoys;
}

/**
 * Split string into characters array
 */
function splitIntoChars(str: string): string[] {
    return str.split('');
}

/**
 * Obfuscate encryption key into multiple segments
 *
 * @param key - Original encryption key
 * @param segments - Number of segments to split into (default: 4)
 * @returns Obfuscated key structure with reconstruction code
 */
export function obfuscateKey(key: string, segments: number = 4): {
    code: string;
    reconstructVar: string;
} {
    // Split key into character array
    const chars = splitIntoChars(key);
    const charsPerSegment = Math.ceil(chars.length / segments);

    // Generate random variable names
    const varNames: string[] = [];
    for (let i = 0; i < segments; i++) {
        varNames.push(generateRandomVarName());
    }

    // Split into segments
    const keySegments: string[][] = [];
    for (let i = 0; i < segments; i++) {
        const start = i * charsPerSegment;
        const end = Math.min(start + charsPerSegment, chars.length);
        keySegments.push(chars.slice(start, end));
    }

    // Generate decoy arrays
    const decoyCount = 10 + Math.floor(Math.random() * 20); // 10-30 decoys
    const decoys = generateDecoys(decoyCount);
    const decoyVarNames: string[] = [];
    for (let i = 0; i < decoyCount; i++) {
        decoyVarNames.push(generateRandomVarName());
    }

    // Build obfuscated code
    let code = '// Configuration data\n';

    // Add decoy arrays mixed with real segments
    const allVars = [...varNames, ...decoyVarNames];
    const allData = [...keySegments.map(seg => seg), ...decoys.map(d => splitIntoChars(d))];

    // Shuffle them together
    const combined = allVars.map((name, idx) => ({ name, data: allData[idx] }));

    // Fisher-Yates shuffle
    for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    // Generate variable declarations
    combined.forEach(({ name, data }) => {
        code += `const ${name}=${JSON.stringify(data)};`;
    });

    code += '\n';

    // Generate reconstruction variable name
    const reconstructVar = generateRandomVarName();

    // Generate reconstruction code
    code += `const ${reconstructVar}=[`;
    code += varNames.map(v => `...${v}`).join(',');
    code += `].join('');`;

    return {
        code,
        reconstructVar
    };
}

/**
 * Obfuscate multiple keys (for when you have multiple encryption keys)
 */
export function obfuscateMultipleKeys(keys: Record<string, string>): {
    code: string;
    reconstructVars: Record<string, string>;
} {
    let code = '';
    const reconstructVars: Record<string, string> = {};

    Object.entries(keys).forEach(([keyName, keyValue]) => {
        const obfuscated = obfuscateKey(keyValue);
        code += obfuscated.code + '\n';
        reconstructVars[keyName] = obfuscated.reconstructVar;
    });

    return {
        code,
        reconstructVars
    };
}

/**
 * Simple obfuscation for inline embedding
 * Splits key into 4 random-named arrays with decoys
 */
export function obfuscateKeyInline(key: string): string {
    const obfuscated = obfuscateKey(key, 4);
    return `(function(){${obfuscated.code}return ${obfuscated.reconstructVar};})()`;
}
