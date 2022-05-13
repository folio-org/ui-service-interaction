## useNumberGenerators

This is a hook which will fetch number generator objects from `mod-service-interaction`.

## Basic usage
The use of this hook assumes that NumberGenerators and sequences have been set up for the tenant via the `ui-service-interaction` settings panel.

For actually generating numbers, the hook `useGenerateNumbers`, as well as the components `NumberGeneratorButton` and `NumberGeneratorModalButton` are exposed from this library.

This component returns a list of number generator objects.
```
import { useNumberGenerators } from '@folio/service-interaction';

const MyComponent = () => {
  const {
    data: {
      results = []
    } = {}
  } = useNumberGenerators('UserBarcode');

  /* This will be a list of NumberGenerator objects.
   * If a code was passed (in this case 'UserBarcode')
   * then the list should be of length 1
   * (or 0 if the code does not match)
   * 
   * If no code was passed, the results list
   * will contain every NumberGenerator
   * in the system.
   */

  const firstNumberGenerator = results[0];
  console.log("Number generator: %o", firstNumberGenerator);

  return (
    <ul>
      {firstNumberGenerator?.sequences?.map(ng => {
        <li>ng</li>
      })}
    </ul>
  );
}

```

The above will render a list of the sequences found for the NumberGenerator with code 'UserBarcode', as well as logging the actual Number generator object to the console.

## QueryObject
The hook returns the full return from the `useQuery` hook. This includes a `data` section containing the `NumberGenerator` objects, which themselves contain the `NumberGeneratorSequence` objects. It also includes other information, see the react-query documentation for `useQuery` to find out more.

This query can be manually invalidated, forcing a refetch everywhere this hook is in use, by a combination of the `react-query` invalidateQueries mechanism and the number generators endpoint exposed through this library.

```
import { useQueryClient } from 'react-query';
import { NUMBER_GENERATORS_ENDPOINT } from '@folio/service-interaction';

const MyInvalidateButton = () => {
  const queryClient = useQueryClient();

  return (
    <button
      onClick={() => queryClient.invalidateQueries(NUMBER_GENERATORS_ENDPOINT)}
    >Invalidate</button>
  );
}
```

## Parameters
Name | Index | Type | Description | default | required
--- | --- | --- | --- | --- | --- |
code | 0 | String | The `code` of a NumberGenerator set up in the Settings panel for `ui-service-interaction` | | ✕ |