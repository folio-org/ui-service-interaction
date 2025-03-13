## 4.0.0 2024-03-13
  * SI-108 *BREAKING* Stripes v10 dependencies update
    Updated all stripes-* dependencies for the stripes v10 upgrade along with react-intl and formatjs/cli
  * Removed dismissible from ModalButton as default
  * Fixed translations file escape characters 

## 3.1.1 2024-11-28
  * SI-76 Checksum method display enhancements
  * SI-75 Help text adjustments for modal new sequence/edit sequence and detail pane sequences
  * SI-74 Detail pane number generator sequences display enhancements
  * SI-73 Modal new sequence/edit sequence display enhancements
  * SI-72 Auto-populated fields input and output template and mandatory fields
  * SI-59 Number generator sequences - message banner when new sequences are saved - insert different token

## 3.1.0 2024-10-31
  * ERM-3184 Make use of shared NumberField from kint-components
  * SI-67 List @folio/stripes-erm-components as dependency
  * SI-54 Number generator: Error Message for non-unique code of sequences while trying to create new sequence
  * SI-49 Type down: selected generator text
  * SI-48 Type down: checkbox presentation
  * SI-47 Type down: Fix text and background contrast ratio
  * SI-16 Service interaction > Number generator sequences “Certain ARIA roles must not contain children”
  * SI-15 Service interaction > Number generators “Form elements must have labels”
  * Hook improvements
    * Added catchQueryCalls prop to useMutateNumberGeneratorSequence
    * Ensured query results are passed back to afterQueryCalls for both useMutateNumberGenerator and useMutateNumberGeneratorSequence
  * Code cleanup and test coverage
  * NumberGeneratorSelector: New exposed component NumberGeneratorSelector which was previously an internal implementation within NumberGeneratorModal. Now available for use in other implementations, with slightly expanded confiugurability and functionality.
  * Fixed Number Generator Sequence settings page not querying by all qIndices when all options are deselected (For stripes-erm-components versions including fix for ERM-3186)
  * FOLIO-4086 Fix GitHub Actions workflow not running for tags

## 3.0.1 2024-04-09
  * SI-46: Number generator openAccess not considering sequence information output template and format
  * Sequence filters in settings expanded to include "No maximum set" and relabel "" to "All"
  * Fix form reset after failed sequence POST/PUT, makes use of kint-components v5.6.0
  * Prevent negative number entry into Number Generator Sequence fields in settings

## 3.0.0 2024-03-22
  * SI-44 Refinement wording in number generators and sequences
  * SI-43 Permissions for ui service interaction and number generators
  * SI-42 Display alerts when the next value in a sequence is over the threshold or = max value
  * SI-22 Replace the component for selecting a sequence, in-app
  * SI-6 Alert the user when a sequence is approaching the end of its available numbers
  * SI-4 Add search, sort and filter to Sequences page

## 2.0.0 2023-10-16
  * Added test coverage for components and hooks
  * Added features to NumberGenerator Modal
    * Added disabled select whenever there is only a single sequence
    * Added cancel button to modal footer
    * Added render extra render props to allow for rendering of extra information 
    * Refactor select options render method
  * ERM-2641 Upgrade to Grails 5 (including Hibernate 5.6.x) for Poppy
    * Added okapi interface dependency on new servint interface 3.0
  * ERM-2529 Remove BigTest/Nightmare dependencies and tests
  * STRIPES-870 *BREAKING* upgrade react to v18
    * SI-27 upgrade React to v18
  * SI-37 *BREAKING* bump `react-intl` to `v6.4.4`
  * SI-26 Link to documentation to open in a new tab
  * SI-17 Added autofocus to first field in number generator sequence form modal  
  * SI-14 Number generators “id attribute value must be unique”
  * SI-13 Name and Code should be mandatory for a Number Generator
  * SI-8 Add the Service Interaction icon to Settings
  * SI-5 Added help banner to Number Generator Settings page

## 1.0.0 2023-01-10
  * Exposed components:
    * NumberGeneratorButton
    * NumberGeneratorModal
    * NumberGeneratorModalButton
    * ModalButton
  * Exposed hooks:
    * useNumberGenerators,
    * useMutateNumberGenerator,
    * useMutateNumberGeneratorSequence,
    * useGenerateNumber
  * Settings page for configuring number generators/sequences
