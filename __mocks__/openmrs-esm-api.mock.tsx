export function openmrsFetch() {
  console.log("I am here");
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
