export interface Spec<TValue> {
  /**
   * An Array that lists the admissible parsed values for the env var.
   */
  choices?: ReadonlyArray<TValue>;
  /**
   * A fallback value, which will be used if the env var wasn't specified. Providing a default effectively makes the env var optional.
   */
  default?: TValue;
  /**
   * A fallback value to use only when `NODE_ENV` is not `production`.
   * This is handy for env vars that are required for production environments, but optional for development and testing.
   */
  devDefault?: TValue;
  /**
   * Do not treat an empty string as a missing variable.
   * It will then not be defaulted over and error if it isn't allowed.
   * @default false
   */
  allowEmpty?: boolean;
  /**
   * A string that describes the env var.
   */
  desc?: string;
  /**
   * An example value for the env var.
   */
  example?: string | TValue;
  /**
   * A url that leads to more detailed documentation about the env var.
   */
  docs?: string;
  /**
   * If you want to override what is passed to the parser, defaults to `env[key]`
   * Can be useful on the front-end when webpack makes the vars disappear
   */
  input?: string | undefined;
}

export interface ValidatorSpec<TValue> extends Spec<TValue> {
  _parse: (input: string | TValue) => TValue;
}

export type Environment = Record<string, string | undefined>;

export type Errors = Record<string, Error>;

export type ReporterOpts<TCleanEnv> = {
  env: Environment;
  output: Partial<TCleanEnv>;
  errors: Errors;
};

export type ReporterFn<TCleanEnv> = (opts: ReporterOpts<TCleanEnv>) => void;

export type EnvsafeOpts<TCleanEnv> = {
  /**
   * Override the built-in reporter
   * @default `defaultReporter`
   */
  reporter?: ReporterFn<TCleanEnv>;
  /**
   * @default process.env
   */
  env?: Environment;
  /**
   * Wrap the returned object in a `Proxy` which throws an error whenever an attempt is made to access an undefined property
   * Useful if you're not using TypeScript
   * @default false
   */
  strict?: boolean;
};

export type Validators<TCleanEnv> = {
  [K in keyof TCleanEnv]: ValidatorSpec<TCleanEnv[K]>;
};
