import { InvalidEnvError, MissingEnvError } from '../src/errors';
import { defaultReporterText } from '../src/reporter';

test('reporter', () => {
  const errors = {
    foo: new InvalidEnvError('invalid'),
    bar: new MissingEnvError('missing'),
    zoo: new MissingEnvError('missing'),
  };
  expect(defaultReporterText({ errors, env: {}, output: {} }))
    .toMatchInlineSnapshot(`
    "=================================================
    ❌ Invalid environment variables:
        foo: invalid
    💨 Missing environment variables:
        bar: missing
        zoo: missing
    ================================================="
  `);
});
