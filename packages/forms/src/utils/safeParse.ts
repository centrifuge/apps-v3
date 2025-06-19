import type { z } from 'zod'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export function safeParse<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  value?: DeepPartial<z.input<TSchema>>
): z.output<TSchema> | undefined {
  const result = schema.safeParse(value)

  if (!result.success) {
    return undefined
  }

  return result.data
}
