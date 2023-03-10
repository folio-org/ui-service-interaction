## NumberGeneratorModal

This is a smart component aimed at allowing an implementor to hook into mod-service-interaction's "NumberGenerator" features, including selecting a given sequence.

## Basic usage
The use of this Modal assumes that NumberGenerators and sequences have been set up for the tenant via the `ui-service-interaction` settings panel.

This component uses the `useNumberGenerators` hook and the `NumberGeneratorButton` component under the hood, which in turn uses the `useGenerateNumber` hook. These can be implemented separately for greater control over the interactions.
```
import { useState } from 'react';
import { NumberGeneratorModal } from '@folio/service-interaction';

const MyComponent = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <NumberGeneratorModal
        callback={(generatedString) => {
          alert("Number generated: " + generatedString)}
          setOpen(false)
        }
        generator='UserBarcode'
        id="my-generator-modal"
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

```

The above will render a Modal (Openable via the also rendered Button). This modal will present the user with a Select and a Button marked "Generate". The Select allows the user to select between sequences on the given generator, and the generate button acts as a `NumberGeneratorButton`.

## Props
Name | Type | Description | default | required
--- | --- | --- | --- | ---
callback | function | A callback which accepts a generated string. | | ✓ |
id | String | A string to uniquely identify the Modal. Will result in an id `number-generator-modal-${id}` on the modal itself and `clickable-trigger-number-generator-${id}` on the generate button inside the modal. | | ✓ |
generateButtonLabel | String/Node | An override for the label of the button rendered within the modal | "Generate" | ✕ |
generator | String | The `code` for a given NumberGenerator set up in `ui-service-interaction`'s Settings panel. When not provided the Select will comprise of all sequences for all NumberGenerators fetched. | | ✕ |
generatorButtonProps | object | An object containing button props to be passed onto the "generate" button within the modal. | | ✕ |
renderBottom | function | A function which renders at the bottom of the modal, below the select(s) and generate button. | | ✕ |
renderTop | function | A function which renders at the top of the modal, above the select(s). | | ✕ |
...modalProps | destructured object | Any other props passed to NumberGeneratorModal will be assumed to be modal props and passed directly on. Within these it is vital to provide an `open` and an `onClose` prop, as per the stripes-components Modal. | | ✕ |