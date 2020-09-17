export interface Spec<TValue> {
  /**
   * An Array that lists the admissable parsed values for the env var.
   */
  choices?: ReadonlyArray<TValue>;
  /**
   * A fallback value, which will be used if the env var wasn't specified. Providing a default effectively makes the env var optional.
   */
  default?: TValue;
  /**
   * A fallback value to use only when NODE_ENV is not 'production'.
   * This is handy for env vars that are required for production environments, but optional for development and testing.
   */
  devDefault?: TValue;
  /**
   * A string that describes the env var.
   */
  desc?: string;
  /**
   * An example value for the env var.
   */
  example?: string;
  /**
   * A url that leads to more detailed documentation about the env var.
   */
  docs?: string;
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

export type CleanEnvOpts<TCleanEnv> = {
  /**
   * Override the built-in reporter
   */
  reporter?: ReporterFn<TCleanEnv>;
  /**
   * @default process.env
   */
  env?: Environment;
  /**
   * Wraps the returned object in a Proxy which throws an error whenever an attempt is made to access an undefined property
   * @default false
   */
  strict?: boolean;
};

export type Validators<TCleanEnv> = {
  [K in keyof TCleanEnv]: ValidatorSpec<TCleanEnv[K]>;
};
