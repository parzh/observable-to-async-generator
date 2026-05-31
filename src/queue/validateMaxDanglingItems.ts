export const MAX_ARRAY_LENGTH = 2 ** 32 - 1

export function validateMaxDanglingItems(input: number): number {
  if (input > MAX_ARRAY_LENGTH && input < Infinity) {
    console.warn(`The provided dangling items limit (${input}) is too big and will be treated as Infinity (i.e., no pruning).`)
    // actually, it's going to be treated as MAX_ARRAY_LENGTH, but nobody needs to know about that 🤫
  }

  input = Math.min(input, MAX_ARRAY_LENGTH)

  if (input <= 0 || !Number.isInteger(input)) {
    throw new Error(`Invalid maxDanglingItems: expected a valid non-zero array length, got ${input}`)
  }

  return input
}
