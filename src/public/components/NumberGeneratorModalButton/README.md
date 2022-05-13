## NumberGeneratorModalButton

This is a smart component aimed at allowing an implementor to hook into mod-service-interaction's "NumberGenerator" features, including selecting a given sequence.

## Basic usage
The use of this button assumes that NumberGenerators and sequences have been set up for the tenant via the `ui-service-interaction` settings panel.

This component uses the `useNumberGenerators` hook and the `NumberGeneratorButton` component under the hood, which in turn uses the `useGenerateNumber` hook. These can be implemented separately for greater control over the interactions.
```
import { NumberGeneratorModalButton } from '@folio/service-interaction';

const MyComponent = () => {
  return (
    <NumberGeneratorModalButton
      callback={(generatedString) => alert("Number generated: " + generatedString)}
      generator='UserBarcode'
    />
  );
}

```

The above will render a button with the text "Select generator". This button will open a modal, where the user is presented with a Select and a Button marked "Generate". The Select allows the user to select between sequences on the given generator, and the generate button acts as a `NumberGeneratorButton`.

## Props
Name | Type | Description | default | required
--- | --- | --- | --- | ---
callback | function | A callback which accepts a generated string. | | ✓ |
id | String | A string to uniquely identify the button. Will result in an id `clickable-trigger-modal-number-generator-${id}` on the modal button and `clickable-trigger-number-generator-${id}` on the generate button inside the modal. | | ✓ |
generator | String | The `code` for a given NumberGenerator set up in `ui-service-interaction`'s Settings panel. When not provided the Select will comprise of all sequences for all NumberGenerators fetched. | | ✕ |
