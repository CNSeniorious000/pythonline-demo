import getPy from "..";
import { toastMarkdown } from "$lib/utils/toast";

export async function suggestTitle(sources: Record<string, string>) {
  const py = await getPy({ chat: true });
  const generateTitle = py.pyimport("chat.suggest.suggest_title");
  const id = toastMarkdown("正在生成标题...", "loading");
  let res = "";
  try {
    for await (const i of generateTitle(py.toPy(sources) as AsyncGenerator<string>)) {
      res += i;
      toastMarkdown(res, "loading", id);
    }
    toastMarkdown(res, "success", id);
    return res;
  }
  catch (e) {
    toastMarkdown((e as Error).message, "error", id);
    throw e;
  }
}
