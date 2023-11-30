export const exclude = <Model, Key extends keyof Model>(
  model: Model,
  keys: Key[],
) =>
  Object.fromEntries(
    Object.entries(model).filter(([key]) => !keys.includes(key as Key)),
  );