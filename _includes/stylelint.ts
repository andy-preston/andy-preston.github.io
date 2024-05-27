import { relative, resolve } from "https://deno.land/std/path/mod.ts";
import stylelint from "npm:stylelint";
import stylelintConfigStandard from "npm:stylelint-config-standard";

type Severity = "warning" | "error";

interface Warning {
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    rule: string;
    severity: Severity;
    text: string;
    stylelintType?: string;
}

interface LintResult {
    source?: string;
    deprecations: {
        text: string;
        reference?: string;
    }[];
    invalidOptionWarnings: {
        text: string;
    }[];
    parseErrors: {
        stylelintType: string
    }[];
    errored?: boolean;
    warnings: Warning[];
    ignored?: boolean;
}

const options = {
    "config": {
        "rules": {
            ...stylelintConfigStandard.rules,
            "max-nesting-depth": 0,
            "comment-empty-line-before": null
        }
    },
    "cacheLocation": "/var/tmp/",
    "files": "_includes/**/*.css"
};

const { results }: { "results": LintResult[] } = await stylelint.lint(options);

const issues: string[] = [];
const deprecationWarnings = new Set<string>();
const __dirname = resolve();

results.forEach(({ deprecations, errored, source, warnings }) => {
    if (errored && source) {
        const outputPath = relative(__dirname, source);
        issues.push(outputPath);
        warnings.forEach(({ column, line, text }) => {
            issues.push(` ${line}:${column}  *  ${text}`);
        });
        issues.push("");
    }
    deprecations.forEach(({ text }) => {
        deprecationWarnings.add(text);
    });
});

if (deprecationWarnings.size) {
    console.log("Deprecation warnings:");
    deprecationWarnings.forEach((element) => {
        console.log(` - ${element}`);
    });
    console.log("");
}

if (issues.length) {
    console.log(issues.join("\n"));
    Deno.exit(1);
}
