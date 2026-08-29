
export const readFile = async(fileName: string) => {
  if (fileName) {
    return "File read successfully. It contains a for loop to add numbers from 1 to 1000"
  } else {
    return "Cannot read the file"
  }
}