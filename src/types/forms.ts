import React from 'react';

// See https://stackoverflow.com/questions/42081549/typescript-react-event-types
export type InputChangeEventHandler = React.ChangeEvent<HTMLInputElement>;
export type TextareaChangeEventHandler = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEventHandler = React.ChangeEvent<HTMLSelectElement>;
