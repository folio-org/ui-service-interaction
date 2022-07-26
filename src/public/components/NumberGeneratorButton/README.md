## NumberGeneratorButton

This is a smart component aimed at allowing an implementor to hook into mod-service-interaction's "NumberGenerator" features.

## Basic usage
The use of this button assumes that NumberGenerators and sequences have been set up for the tenant via the `ui-service-interaction` settings panel.

This component uses the `useGenerateNumber` hook under the hood, which can be implemented for a more custom component.
```
import { NumberGeneratorButton } from '@folio/service-interaction';

const MyComponent = () => {
  return (
    <NumberGeneratorButton
      callback={(generatedString) => alert("Number generated: " + generatedString)}
      generator='UserBarcode'
      id="my-generator-button"
      sequence='patron'
    />
  );
}

```

The above will render a button with the text "Generate", and each time it is clicked will raise an alert with a sequential generated number.

## Props
Name | Type | Description | default | required
--- | --- | --- | --- | ---
buttonLabel | String/Node | An override for the label of the button | "Generate" | ✕ |
callback | function | A callback which accepts a generated string. | | ✓ |
id | String | A string to uniquely identify the button. Will result in an id `clickable-trigger-number-generator-${id}` on the button. | | ✓ |
generator | String | The `code` for a given NumberGenerator set up in `ui-service-interaction`'s Settings panel. | | ✓ |
sequence | String | The `code` for a given sequence in the specified generator. Also set up in the Settings panel for `ui-service-interaction`. | | ✓ |
...buttonProps | destructured object | Any other props passed to NumberGeneratorButton will be assumed to be button props and passed directly on. | | ✕ |