## useGenerateNumber

This is a hook aimed at allowing an implementor to hook into mod-service-interaction's "NumberGenerator" features.

## Basic usage
The use of this hook assumes that NumberGenerators and sequences have been set up for the tenant via the `ui-service-interaction` settings panel.

For a simpler integration, `NumberGeneratorButton` and `NumberGeneratorModalButton` are exposed from this library.
```
import { useState } from 'react';
import { useGenerateNumber } from '@folio/service-interaction';

const MyComponent = () => {
  const [generatedString, setGeneratedString] = useState('');

  const { generate } = useGenerateNumber({
    callback: setGeneratedString,
    generator: 'UserBarcode',
    sequence: 'patron
  })

  return (
    <>
      <button onClick={generate}>
        Generate
      </button>
      <div>{generatedString}</div>
    </>
  );
}

```

The above will render a button with the text "Generate", and a div which will display the results of the last generate call.

## QueryObject
The hook also returns `queryObject`, the full return from the `useQuery` hook. This includes a `data` section containing the previously generated number, as well as the `refetch` function which is the same as the passed `generate`. It also includes other information, see the react-query documentation for `useQuery` to find out more.

## Props
Name | Type | Description | default | required
--- | --- | --- | --- | ---
callback | function | A callback which accepts a generated string. | () => null | ✕ |
generator | String | The `code` for a given NumberGenerator set up in `ui-service-interaction`'s Settings panel | | ✓ |
sequence | String | The `code` for a sequence for the given NumberGenerator, also set up in `ui-service-interaction`'s Settings panel | | ✓ |
queryOptions | Object | Optional paramters to pass to `useQuery`. By default it sets `enabled` to `false`, ensuring that a new number is not generated on mount, as well as setting `cacheTime` to `0`, so that the hook will always return a new generated string. It is highly recommended not to change these settings. | { enabled: false, cacheTime: 0 } | ✕ |