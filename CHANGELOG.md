## 3.1.0 In progress
  * SI-46: Number generator openAccess not considering sequence information output template and format
  * Sequence filters in settings expanded to include "No maximum set" and relabel "" to "All"
  * Fix form reset after failed sequence POST/PUT, makes use of kint-components v5.6.0
  * Hook improvements
    * Added catchQueryCalls prop to useMutateNumberGeneratorSequence
    * Ensured query results are passed back to afterQueryCalls for both useMutateNumberGenerator and useMutateNumberGeneratorSequence
  * Prevent negative number entry into Number Generator Sequence fields in settings
  * Code cleanup and test coverage
  * NumberGeneratorSelector: New exposed component NumberGeneratorSelector which was previously an internal implementation within NumberGeneratorModal. Now available for use in other implementations, with slightly expanded confiugurability and functionality.



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
  * SI26 Link to documentation to open in a new tab
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
