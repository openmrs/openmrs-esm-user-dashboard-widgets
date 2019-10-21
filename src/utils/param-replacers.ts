const replaceToday = (rawText: string) => {
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  return rawText.replace(/%Today%/g, today);
};

export default function replaceParams(rawText: string): string {
  const parameterReplacers = [replaceToday];

  return parameterReplacers.reduce(
    (modifiedText, replacer) => replacer(modifiedText),
    rawText
  );
}
