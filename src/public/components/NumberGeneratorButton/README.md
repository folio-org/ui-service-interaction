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
disabled | Boolean | A boolean to manually take control of whether or not the button is disabled (Will ignore pre-existing logic). Pre-existing behaviour is to disable when the selected sequence is not enabled or is at maximum value. | | ✕ |
displayError | Boolean | When set to "true" an error message will render underneath the NumberGeneratorButton when the selected sequence has maximumCheck "at_maximum" | true | ✕ |
displayWarning | Boolean | When set to "true" a warning message will render underneath the NumberGeneratorButton when the selected sequence has maximumCheck "over_threshold" | false | ✕ |
id | String | A string to uniquely identify the button. Will result in an id `clickable-trigger-number-generator-${id}` on the button. | | ✓ |
generator | String | The `code` for a given NumberGenerator set up in `ui-service-interaction`'s Settings panel. | | ✓ |
sequence | String | The `code` for a given sequence in the specified generator. Also set up in the Settings panel for `ui-service-interaction`. | | ✓ |
sequence | String | The `code` for a given sequence in the specified generator. Also set up in the Settings panel for `ui-service-interaction`. | | ✓ |
useNumberGeneratorParams | Object | This component can accept direct parameters for the useNumberGenerator that is called within. The callback/generator/sequence props above can be used directly, but if the keys are also present in the passed `useNumberGeneratorParams` object then this prop will take precedence. | `{ callback, generator, sequence }` from props above. | ✕ |
...buttonProps | destructured object | Any other props passed to NumberGeneratorButton will be assumed to be button props and passed directly on. | | ✕ |
