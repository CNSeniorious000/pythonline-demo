import BaseMarkdown from "$lib/components/markdown/BaseMarkdown.svelte";
import { tick } from "svelte";
import { toast } from "svelte-sonner";

export function withToast(data: { loading: string; success?: string; duration?: number }) {
  return <T extends (...args: any[]) => any>(anyFunction: T) => {
    data.success = data.success ?? data.loading;
    return (async (...args) => {
      const promise: Promise<ReturnType<T>> = Promise.resolve(anyFunction(...args));
      toast.promise(promise, { ...data, error: data.loading });
      const result = await promise;
      await tick();
      return result;
    }) as T;
  };
}

let index = 0;

export function toastMarkdown(markdown: string, type: "message" | "success" | "info" | "warning" | "error" | "loading" = "success", id = index++) {
  // @ts-expect-error promise option is not in the type definition
  toast[type](BaseMarkdown, { componentProps: { text: markdown }, id, promise: true });
  return id;
}
