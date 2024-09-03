import type { Node } from "telegra.ph/typings/telegraph";

export function serialize(sources: Record<string, string>): Node[] {
  return [
    { tag: "pre", children: [JSON.stringify(sources, null, 3)] },
  ];
}

export function deserialize(content: Node[]): Record<string, string> {
  const [{ children: [json] }] = content as unknown as [{ children: [string] }];
  return JSON.parse(json);
}
