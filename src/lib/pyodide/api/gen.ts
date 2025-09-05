import getPy from "..";
import { toastMarkdown } from "$lib/utils/toast";

export async function* genReadme(sources: Record<string, string>) {
  const py = await getPy({ chat: true });
  const generateTitle = py.pyimport("chat.gen.generate_readme");
  const id = toastMarkdown("正在生成自述文件……", "loading");
  let res = "";
  try {
    for await (const i of generateTitle(py.toPy(sources) as AsyncGenerator<string>)) {
      res += i;
      yield res;
      toastMarkdown(`正在生成自述文件……${res.length}`, "loading", id);
    }
    toastMarkdown("成功生成自述文件", "success", id);
    return res;
  }
  catch (e) {
    toastMarkdown((e as Error).message, "error", id);
    throw e;
  }
}
