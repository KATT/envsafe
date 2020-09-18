import { MissingEnvError } from './errors';
import { ReporterOpts } from './types';

export function defaultReporterText<TCleanEnv>({
  errors,
}: ReporterOpts<TCleanEnv>) {
  const keys = Object.keys(errors);

  const invalids: string[] = [];
  const missing: string[] = [];

  for (const key of keys) {
    const err = errors[key];
    if (err instanceof MissingEnvError) {
      missing.push(`    ${key}: ${err.message || 'required'}`);
    } else {
      invalids.push(`    ${key}: ${err.message || 'invalid'}`);
    }
  }
  if (invalids.length) {
    invalids.unshift('❌ Invalid environment variables:');
  }
  if (missing.length) {
    missing.unshift('💨 Missing environment variables:');
  }

  const output: string[] = [
    '========================================',
    ...invalids,
    ...missing,
    '========================================',
  ];

  return output.join('\n');
}

export function defaultReporter<TCleanEnv>(opts: ReporterOpts<TCleanEnv>) {
  const text = defaultReporterText(opts);
  console.error(text);

  if (typeof window !== 'undefined' && window?.alert) {
    window.alert(text);
  }

  throw new TypeError(text);
}
