export function openmrsFetch() {
  return Promise.resolve({
    contents: [
      {
        library: {
          module: "test-widget"
        }
      }
    ]
  });
}
