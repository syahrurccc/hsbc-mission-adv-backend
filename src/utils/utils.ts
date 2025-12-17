export function throwErr(msg: string, code: number): never {
  const err = new Error(msg);
  (err as any).status = code;
  throw err;
}