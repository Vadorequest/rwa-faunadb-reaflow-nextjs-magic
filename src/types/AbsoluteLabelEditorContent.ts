export type AbsoluteLabelEditorContent = {
  isDisplayed: boolean;
  x?: number;
  y?: number;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
}
