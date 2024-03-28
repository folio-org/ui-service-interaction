## NumberGeneratorSelector

This is a smart component aimed at allowing an implementor to hook into mod-service-interaction's "NumberGenerator" features to select a given sequence.

## Basic usage
The use of this Modal assumes that NumberGenerators and sequences have been set up for the tenant via the `ui-service-interaction` settings panel.

This component uses the `useNumberGenerators` hook under the hood to present a `QueryTypedown` (from `@k-int/stripes-kint-components`) with number generators to select from.

```
import { useState } from 'react';
import { NumberGeneratorSelector } from '@folio/service-interaction';

const MyComponent = () => {
  const [selectedSequence, setSelectedSequence] = useState();
  return (
    <NumberGeneratorSelector
      generator='UserBarcode'
      id="some-id"
      onSequenceChange={seq => setSelectedSequence(seq)}
    />
  );
}

```

The above will render a QueryTypedown The Typedown allows the user to select between sequences on the given generator, or across all sequences where no generator is specified.

The footer of the QueryTypedown presents two options "Include sequences which have reached their maximum value" and "Exact code match". These are fairly self explanatory: the former  toggles on/off the fetch including sequences which have reached their maximum value, and the latter will only return the sequence (if any) whose code _exactly_ matches what the user has entered into the QueryTypedown.

## Props
Name | Type | Description | default | required
--- | --- | --- | --- | ---
displayError | Boolean | When set to "true" an error message will render underneath the sequence selection component when the selected sequence has maximumCheck "at_maximum" | true | ✕ |
displayWarning | Boolean | When set to "true" a warning message will render underneath the sequence selection component when the selected sequence has maximumCheck "over_threshold" | false | ✕ |
id | String | A string to uniquely identify the Modal. Will result in an id `number-generator-modal-${id}` on the modal itself and `clickable-trigger-number-generator-${id}` on the generate button inside the modal. | | ✓ |
generator | String | The `code` for a given NumberGenerator set up in `ui-service-interaction`'s Settings panel. When not provided the Select will comprise of all sequences for all NumberGenerators fetched. | | ✕ |
onSequenceChange | Function | A function which takes a sequence object as a parameter. When the sequence is selected or removed, this callback will also be triggered so the calling component can hook into the internal state.
...queryTypedownProps | destructured object | Any other props passed to NumberGeneratorSelector will be assumed to be QueryTypedown props and passed directly on. | | ✕ |